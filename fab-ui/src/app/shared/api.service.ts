import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, switchAll } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
    tax_category: string;
    name: string;
    price: number;
    pk: number;
}

export interface CartItem {
    fk_item: number;
    user_id: string;
    timestamp: Date;
    quantity: number;
    pk: number;
    name: string;
    price: number;
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    apiRoot = environment.baseUrl;
    http: HttpClient = inject(HttpClient);

    items: Item[] = [];

    constructor() {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiRoot}/items/`).pipe(map((res) => (this.items = res)));
    }

    addItemToCart(item: Item, quantity: number = 1): Observable<CartItem[]> {
        const params = new HttpParams().set('item_pk', item.pk).set('quantity', quantity);
        return this.http.post<CartItem[]>(`${this.apiRoot}/cart/add-item`, null, { params });
    }

    getCart(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`${this.apiRoot}/cart/`);
    }

    orderCart(): Observable<CartItem[]> {
        return this.http.post<CartItem[]>(`${this.apiRoot}/orders/order-cart`, null);
    }
}
