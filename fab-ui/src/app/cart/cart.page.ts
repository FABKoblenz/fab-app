import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonTitle, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { DecimalPipe } from '@angular/common';
import { ApiService, CartItem } from '../shared/api.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cart',
    templateUrl: 'cart.page.html',
    styleUrls: ['cart.page.scss'],
    imports: [IonContent, HeaderComponent, DecimalPipe, IonButton, IonIcon, IonItem, IonLabel, IonToast, IonFooter, IonToolbar, IonTitle],
})
export class CartPage implements OnInit, OnDestroy {
    isToastOpen = false;
    toastMessage: string = '';
    toastColor: string = 'success';

    apiService: ApiService = inject(ApiService);
    cartItems: CartItem[] = [];

    fullTotal = 0;

    subscriptions: Subscription[] = [];
    constructor() {}

    ngOnInit() {
        this.getItems();
    }

    getItems() {
        const sub = this.apiService.getCart().subscribe((data) => {
            this.cartItems = data;
            this.fullTotal = this.cartItems.reduce((n, { total }) => n + total, 0);
        });
        this.subscriptions.push(sub);
    }

    orderCart() {
        const sub = this.apiService.orderCart().subscribe((data) => {
            this.getItems();
        });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }

    setToastOpen(val: boolean) {
        this.isToastOpen = val;
    }
}
