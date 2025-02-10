import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonToast } from '@ionic/angular/standalone';
import { ApiService, Item } from '../shared/api.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../components/header/header.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-items',
    templateUrl: 'items.page.html',
    styleUrls: ['items.page.scss'],
    imports: [IonContent, HeaderComponent, IonItem, IonLabel, DecimalPipe, IonButton, IonIcon, IonToast],
})
export class ItemsPage implements OnInit, OnDestroy {
    isToastOpen = false;
    toastMessage: string = '';
    toastColor: string = 'success';

    apiService: ApiService = inject(ApiService);
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

    addToCart(item: Item) {
        this.apiService.addItemToCart(item.pk).subscribe(
            () => {
                this.toastMessage = 'Item wurde erfolgreich dem Korb hinzugefuegt!';
                this.toastColor = 'success';
                this.setToastOpen(true);
            },
            (err) => {
                this.toastMessage = 'Something went wrong!';
                this.toastColor = 'danger';
                this.setToastOpen(true);
            }
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];
    }

    setToastOpen(val: boolean) {
        this.isToastOpen = val;
    }
}
