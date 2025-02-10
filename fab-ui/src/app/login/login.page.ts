import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonIcon],
})
export class LoginPage {
    keycloak: Keycloak = inject(Keycloak);
    router: Router = inject(Router);
    constructor() {}

    login() {
        const redirectUri = window.location.origin + '/fab/items';
        this.keycloak.login({ redirectUri }).then(() => {});
    }
}
