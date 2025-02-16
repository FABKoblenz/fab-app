import { Component, inject, Input, OnInit } from '@angular/core';
import { IonButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import Keycloak from 'keycloak-js';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [IonButton, IonButtons, IonHeader, IonTitle, IonToolbar],
})
export class HeaderComponent {
    @Input() title: string = '';

    keycloak: Keycloak = inject(Keycloak);

    constructor() {}

    logout() {
        this.keycloak.logout().then(() => {});
    }
}
