import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonCol, IonButton, IonGrid, NgOptimizedImage, IonLabel],
})
export class LoginPage implements OnInit {
    keycloak: Keycloak = inject(Keycloak);
    router: Router = inject(Router);

    deferredPrompt: any;
    showInstallButton: boolean = false;

    constructor() {}

    ngOnInit() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton = true;
        });
    }

    openInstallPrompt() {
        if (!this.deferredPrompt) {
            return;
        }
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                this.showInstallButton = false;
                this.deferredPrompt = null;
            }
        });
    }

    login() {
        const redirectUri = window.location.origin + '/fab/items';
        this.keycloak.login({ redirectUri }).then(() => {});
    }
}
