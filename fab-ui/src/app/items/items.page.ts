import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from '@ionic/angular/standalone';
import { ApiService, Item } from '../shared/api.service';
import { Subscription } from 'rxjs';
import Keycloak from 'keycloak-js';

@Component({
    selector: 'app-items',
    templateUrl: 'items.page.html',
    styleUrls: ['items.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton],
})
export class ItemsPage implements OnInit, OnDestroy {
    apiService: ApiService = inject(ApiService);
    keycloak: Keycloak = inject(Keycloak);
    items: Item[] = [];

    subscriptions: Subscription[] = [];

    constructor() {}
    ngOnInit() {
        this.getItems();
    }

    getItems() {
        const sub = this.apiService.getItems().subscribe((data) => {
            this.items = data;
        });
        this.subscriptions.push(sub);
    }

    logout() {
        this.keycloak.logout().then(() => {});
        console.log('Logout');
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }
}
