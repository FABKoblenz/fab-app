import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonContent, IonFooter, IonIcon, IonItem, IonLabel, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { DecimalPipe } from '@angular/common';
import { ApiService, CartItem, Order } from '../shared/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { __assign } from 'tslib';

@Component({
    selector: 'app-cart',
    templateUrl: 'cart.page.html',
    styleUrls: ['cart.page.scss'],
    imports: [IonContent, HeaderComponent, DecimalPipe, IonButton, IonIcon, IonItem, IonLabel, IonToast, IonFooter, IonToolbar],
})
export class CartPage implements OnInit, OnDestroy {
    isToastOpen = false;
    toastMessage: string = '';
    toastColor: string = 'success';

    apiService: ApiService = inject(ApiService);
    router: Router = inject(Router);
    cartItems: CartItem[] = [];

    fullTotal = 0;

    subscriptions: Subscription[] = [];
    constructor() {}

    ngOnInit() {
        this.getItems();
        this.apiService.cartItemsSubject.subscribe((items) => {
            this.handleCartItems(items);
        });
    }

    getItems() {
        const sub = this.apiService.getCart().subscribe((items) => {
            this.handleCartItems(items);
        });
        this.subscriptions.push(sub);
    }

    handleCartItems(items: CartItem[]) {
        this.cartItems = items;
        this.fullTotal = this.cartItems.reduce((n, { total }) => n + total, 0);
    }

    orderCart() {
        const sub = this.apiService.orderCart().subscribe(
            (data) => {
                this.getItems();
                this.toastMessage = 'Erfolgreich!';
                this.toastColor = 'success';
                this.setToastOpen(true);
                // Trigger reload of all your orders
                this.apiService.getOrders().subscribe((data: Order[]) => {
                    this.router.navigate(['/', 'fab', 'orders']).then(() => {});
                });
            },
            (err) => {
                this.toastMessage = err.message;
                this.toastColor = 'danger';
                this.setToastOpen(true);
            }
        );
        this.subscriptions.push(sub);
    }

    removeItemFromCart(item: CartItem) {
        this.apiService.removeItemFromCart(item).subscribe((data) => {
            this.handleCartItems(data);
        });
    }

    decrementItemInCart(item: CartItem) {
        if (item.quantity > 1) {
            this.apiService.addItemToCart(item.fk_item, -1).subscribe((_) => {});
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }

    setToastOpen(val: boolean) {
        this.isToastOpen = val;
    }
}
