import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    AutoRefreshTokenService,
    createInterceptorCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    IncludeBearerTokenCondition,
    includeBearerTokenInterceptor,
    provideKeycloak,
    UserActivityService,
    withAutoRefreshToken,
} from 'keycloak-angular';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

defineCustomElements(window);

const urlConditionLocal = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(http:\/\/localhost:5000)(\/.*)?$/i,
    bearerPrefix: 'Bearer',
});

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /.*/,
    bearerPrefix: 'Bearer',
});

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as any).FAB_INSTALL_PROMPT = e;
});

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideKeycloak({
            config: {
                url: 'https://auth.fab.cnidarias.net/auth/',
                realm: 'fab',
                clientId: 'pweb',
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            },
            features: [
                withAutoRefreshToken({
                    onInactivityTimeout: 'logout',
                    sessionTimeout: 60000,
                }),
            ],
            providers: [AutoRefreshTokenService, UserActivityService],
        }),
        {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [urlCondition, urlConditionLocal],
        },
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWithDelay:1000',
        }),
    ],
});
