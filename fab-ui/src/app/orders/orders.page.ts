import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';
import { ApiService, Order } from '../shared/api.service';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-orders',
    templateUrl: 'orders.page.html',
    styleUrls: ['orders.page.scss'],
    imports: [IonContent, HeaderComponent, DecimalPipe, IonButton, IonIcon, IonItem, IonLabel],
})
export class OrdersPage implements OnInit, OnDestroy {
    apiService: ApiService = inject(ApiService);
    items: Order[] = [];

    subscriptions: Subscription[] = [];

    constructor() {}
    ngOnInit() {
        this.getItems();
    }

    getItems() {
        const sub = this.apiService.getOrders().subscribe((data) => {
            this.items = data;
        });
        this.subscriptions.push(sub);
    }

    getDateFormated(order: Order) {
        return new Date(order.timestamp).toLocaleString();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }
}
