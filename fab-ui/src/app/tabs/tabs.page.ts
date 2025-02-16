import { Component, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cart, reorderFour, home, add, trash, checkmark, remove } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import Keycloak from 'keycloak-js';
import { ApiService, CartItem } from '../shared/api.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, CommonModule],
})
export class TabsPage implements OnInit {
    public keycloak: Keycloak = inject(Keycloak);
    public apiService: ApiService = inject(ApiService);

    numberOfItemsInCart = 0;

    constructor() {
        addIcons({ home, cart, reorderFour, add, trash, checkmark, remove });
    }

    ngOnInit() {
        if (this.keycloak.authenticated) {
            this.apiService.getCart().subscribe((data: CartItem[]) => {
                this.updateCartItemCounter(data);
            });
        }
        this.apiService.cartItemsSubject.subscribe((items: CartItem[]) => {
            this.updateCartItemCounter(items);
        });
    }

    updateCartItemCounter(items: CartItem[]) {
        this.numberOfItemsInCart = 0;
        for (const item of items) {
            this.numberOfItemsInCart += item.quantity;
        }
    }
}
