import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    IonButton,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRow,
    IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { ApiService, CartItem, Order, OrderDetails } from '../shared/api.service';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { __assign } from 'tslib';

@Component({
    selector: 'app-orders',
    templateUrl: 'orders.page.html',
    styleUrls: ['orders.page.scss'],
    imports: [
        IonContent,
        HeaderComponent,
        DecimalPipe,
        IonButton,
        IonIcon,
        IonItem,
        IonLabel,
        IonList,
        IonGrid,
        IonRow,
        IonCol,
        IonFooter,
        IonToolbar,
        IonHeader,
    ],
})
export class OrdersPage implements OnInit, OnDestroy {
    apiService: ApiService = inject(ApiService);
    orders: Order[] = [];
    orderDetails: { [pk: number]: OrderDetails } = {};
    isOrdersOpen: boolean[] = [];

    subscriptions: Subscription[] = [];

    constructor() {}

    ngOnInit() {
        this.getItems();
        this.apiService.orderItemsSubject.subscribe((orders: Order[]) => {
            this.handleOrders(orders);
        });
    }

    getItems() {
        const sub = this.apiService.getOrders().subscribe((orders: Order[]) => {
            this.handleOrders(orders);
        });
        this.subscriptions.push(sub);
    }

    handleClick(index: number, order: Order) {
        if (this.isOrdersOpen[index]) {
            this.isOrdersOpen[index] = false;
            return;
        }
        if (this.orderDetails.hasOwnProperty(order.pk)) {
            this.isOrdersOpen[index] = true;
            return;
        }

        this.apiService.getOrderDetails(order.pk).subscribe((items: OrderDetails) => {
            this.orderDetails[order.pk] = items;
            this.orderDetails = { ...this.orderDetails };
            this.isOrdersOpen[index] = true;
        });
    }

    handleOrders(orders: Order[]) {
        this.orders = orders;
        this.isOrdersOpen = this.orders.map((_) => false);
    }

    getDateFormated(order: Order) {
        return new Date(order.timestamp).toLocaleString();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }

    getCurrentMonthName() {
        return new Date().toLocaleString([], { month: 'long' });
    }

    getTotalForCurrentMonth() {
        const currentYear = +new Date().getUTCFullYear();
        const currentMonth = +new Date().getUTCMonth();

        let total = 0;
        for (let order of this.orders) {
            const orderDate = new Date(order.timestamp);
            if (+orderDate.getUTCMonth() === currentMonth && +orderDate.getUTCFullYear() === currentYear) {
                total += order.total_price;
            }
        }
        return total;
    }
}
