import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { InstallPromptService } from '../shared/install-prompt.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonGrid, NgOptimizedImage, IonLabel],
})
export class LoginPage implements OnInit {
    keycloak: Keycloak = inject(Keycloak);
    router: Router = inject(Router);
    installPromptService: InstallPromptService = inject(InstallPromptService);

    constructor() {}

    ngOnInit() {
        if (this.keycloak.authenticated) {
            this.router.navigate(['/fab/items']).then();
        }
    }

    login() {
        const redirectUri = window.location.origin + '/fab/items';
        this.keycloak.login({ redirectUri }).then(() => {});
    }
}
