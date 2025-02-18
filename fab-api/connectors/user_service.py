import inspect

import functools

import typing

import json
from dataclasses import dataclass
from enum import Enum
from starlette._utils import is_async_callable
from starlette.responses import Response
from typing import List, Optional, Dict
from urllib.request import urlopen

from fastapi import Request
from fastapi import Security
from fastapi.exceptions import HTTPException
from fastapi.openapi.models import OAuth2 as OAuth2Model
from fastapi.openapi.models import (
    OAuthFlowAuthorizationCode,
    OAuthFlowClientCredentials,
    OAuthFlowImplicit,
    OAuthFlowPassword,
)
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security.base import SecurityBase
from fastapi.security.utils import get_authorization_scheme_param
from jose import jwt
from jose.exceptions import JWTError
from pydantic import BaseModel
from starlette.status import HTTP_401_UNAUTHORIZED

from configurations import Configurations


class GrantType(str, Enum):
    AUTHORIZATION_CODE = "authorization_code"
    CLIENT_CREDENTIALS = "client_credentials"
    IMPLICIT = "implicit"
    PASSWORD = "password"


def fetch_well_known(issuer: str) -> dict:
    url = f"{issuer}/.well-known/openid-configuration"
    print(f"Fetching well known from {url}")
    with urlopen(url) as response:
        if response.status != 200:
            raise RuntimeError("fail to fetch well-known")
        return json.load(response)


def fetch_jwks(well_known: dict) -> dict:
    url = well_known["jwks_uri"]
    with urlopen(url) as response:
        if response.status != 200:
            raise RuntimeError("fail to fetch jwks")
        return json.load(response)


class JwtDecodeOptions(BaseModel):
    verify_signature: Optional[bool] = None
    verify_aud: Optional[bool] = None
    verify_iat: Optional[bool] = None
    verify_exp: Optional[bool] = None
    verify_nbf: Optional[bool] = None
    verify_iss: Optional[bool] = None
    verify_sub: Optional[bool] = None
    verify_jti: Optional[bool] = None
    verify_at_hash: Optional[bool] = None
    require_aud: Optional[bool] = None
    require_iat: Optional[bool] = None
    require_exp: Optional[bool] = None
    require_nbf: Optional[bool] = None
    require_iss: Optional[bool] = None
    require_sub: Optional[bool] = None
    require_jti: Optional[bool] = None
    require_at_hash: Optional[bool] = None
    leeway: Optional[int] = None


@dataclass()
class OidcSettings:
    well_known: dict
    jwks: dict
    grant_types: set
    authz_url: str
    token_url: str
    flows: OAuthFlowsModel


class OidcResourceServer(SecurityBase):
    def __init__(
        self,
        issuer: str,
        *,
        scheme_name: Optional[str] = "OpenID Connect",
        allowed_grant_types: List[GrantType] = [GrantType.AUTHORIZATION_CODE],
        auto_error: Optional[bool] = True,
        jwt_decode_options: Optional[JwtDecodeOptions] = None,
    ) -> None:
        self.issuer = issuer
        self.scheme_name = scheme_name
        self.allowed_grant_types = allowed_grant_types
        self.auto_error = auto_error
        self.jwt_decode_options = jwt_decode_options
        self.oidc_settings_per_realm: Dict[str, OidcSettings] = {}

        self.get_oidc_settings(Configurations.KEYCLOAK_REALM)
        flows = self.oidc_settings_per_realm[Configurations.KEYCLOAK_REALM].flows
        self.model = OAuth2Model(flows=flows)

    def get_oidc_settings(self, realm: str):
        well_known = fetch_well_known(f"{self.issuer}/realms/{realm}")
        jwks = fetch_jwks(well_known)
        grant_types = set(well_known["grant_types_supported"])
        grant_types = grant_types.intersection(self.allowed_grant_types)

        authz_url = well_known["authorization_endpoint"]
        token_url = well_known["token_endpoint"]

        flows = OAuthFlowsModel()

        if GrantType.AUTHORIZATION_CODE in grant_types:
            flows.authorizationCode = OAuthFlowAuthorizationCode(
                authorizationUrl=authz_url,
                tokenUrl=token_url,
            )

        if GrantType.CLIENT_CREDENTIALS in grant_types:
            flows.clientCredentials = OAuthFlowClientCredentials(tokenUrl=token_url)

        if GrantType.PASSWORD in grant_types:
            flows.password = OAuthFlowPassword(tokenUrl=token_url)

        if GrantType.IMPLICIT in grant_types:
            flows.implicit = OAuthFlowImplicit(authorizationUrl=authz_url)

        oidc_settings = OidcSettings(
            well_known=well_known,
            jwks=jwks,
            grant_types=grant_types,
            authz_url=authz_url,
            token_url=token_url,
            flows=flows,
        )
        self.oidc_settings_per_realm[realm] = oidc_settings
        return oidc_settings

    async def __call__(self, request: Request) -> Optional[str]:
        realm = Configurations.KEYCLOAK_REALM
        if realm not in self.oidc_settings_per_realm:
            self.get_oidc_settings(realm)

        authorization: str = request.headers.get("Authorization")
        scheme, param = get_authorization_scheme_param(authorization)

        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return None
        try:
            return jwt.decode(
                param,
                self.oidc_settings_per_realm[realm].jwks,
                options=self.jwt_decode_options,
            )
        except JWTError:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="JWT validation failed",
                headers={"WWW-Authenticate": "Bearer"},
            )


decode_options = JwtDecodeOptions(verify_aud=False)

auth_scheme = OidcResourceServer(
    f"{Configurations.KEYCLOAK_URL}",
    scheme_name="Keycloak",
    jwt_decode_options=decode_options,
    allowed_grant_types=[GrantType.PASSWORD],
)


def get_current_user(claims: dict = Security(auth_scheme)) -> dict:
    claims.update(
        username=claims.get("preferred_username", ""),
        keycloak_sub=claims["sub"],
        roles=claims.get("realm_access", {}).get("roles", []),
    )
    return claims


def has_required_role(user: any, scopes: typing.Sequence[str]) -> bool:
    user_roles = user.get("roles", [])
    for scope in scopes:
        if scope not in user_roles:
            return False
    return True


def auth_requires(
    scopes: typing.Union[str, typing.Sequence[str]],
    status_code: int = 403,
) -> typing.Callable:
    scopes_list = [scopes] if isinstance(scopes, str) else list(scopes)

    def decorator(func: typing.Callable) -> typing.Callable:
        sig = inspect.signature(func)
        for idx, parameter in enumerate(sig.parameters.values()):
            if parameter.name == "user" or parameter.name == "commons":
                break
        else:
            raise Exception(f'No "user" or "commons" argument on function "{func}"')

        if is_async_callable(func):
            # Handle async request/response functions.
            @functools.wraps(func)
            async def async_wrapper(*args: typing.Any, **kwargs: typing.Any) -> Response:
                user = kwargs.get("user")
                if user is None:
                    commons = kwargs.get("commons")
                    if commons is not None and hasattr(commons, "user"):
                        user = commons.user
                if user is None:
                    raise HTTPException(status_code=status_code)
                if not has_required_role(user, scopes_list):
                    raise HTTPException(status_code=status_code)
                return await func(*args, **kwargs)

            return async_wrapper

        else:
            # Handle sync request/response functions.
            @functools.wraps(func)
            def sync_wrapper(*args: typing.Any, **kwargs: typing.Any) -> Response:
                user = kwargs.get("user")
                if user is None:
                    commons = kwargs.get("commons")
                    if commons is not None and hasattr(commons, "user"):
                        user = commons.user
                if user is None:
                    raise HTTPException(status_code=status_code)
                if not has_required_role(user, scopes_list):
                    raise HTTPException(status_code=status_code)
                return func(*args, **kwargs)

            return sync_wrapper

    return decorator  # type: ignore[return-value]
