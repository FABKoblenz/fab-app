import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { AutoRefreshTokenService, provideKeycloak, UserActivityService, withAutoRefreshToken } from 'keycloak-angular';

defineCustomElements(window);

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideHttpClient(),
        provideKeycloak({
            config: {
                url: 'https://fab.cnidarias.net/auth/',
                realm: 'fab',
                clientId: 'pweb',
            },
            initOptions: {
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            },
            features: [
                withAutoRefreshToken({
                    onInactivityTimeout: 'logout',
                    sessionTimeout: 60000,
                }),
            ],
            providers: [AutoRefreshTokenService, UserActivityService],
        }),
    ],
});
