import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
    selector: 'app-orders',
    templateUrl: 'orders.page.html',
    styleUrls: ['orders.page.scss'],
    imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class OrdersPage {
    constructor() {}
}
