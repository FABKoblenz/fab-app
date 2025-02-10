import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrdersPage } from '../orders/orders.page';

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

export interface Order {
    pk: number;
    total_price: number;
    user_id: string;
    timestamp: Date;
}

export interface OrderDetails {
    user_id: string;
    timestamp: Date;
    total_price: number;
    items: OrderDetailsItem[];
}

export interface OrderDetailsItem {
    fk_order: number;
    fk_item: number;
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

    availableItems: Item[] = [];

    currentCartItems: CartItem[] = [];
    cartItemsSubject: Subject<CartItem[]>;

    currentOrderItems: Order[] = [];
    orderItemsSubject: Subject<Order[]> = new Subject<Order[]>();

    constructor() {
        this.cartItemsSubject = new Subject();
        this.orderItemsSubject = new Subject();
    }

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiRoot}/items/`).pipe(map((res) => (this.availableItems = res)));
    }

    addItemToCart(itemPk: number, quantity: number = 1): Observable<CartItem[]> {
        const params = new HttpParams().set('item_pk', itemPk).set('quantity', quantity);
        return this.http.post<CartItem[]>(`${this.apiRoot}/cart/add-item`, null, { params }).pipe(
            map((data: CartItem[]) => {
                this.currentCartItems = data;
                this.cartItemsSubject.next(data);
                return data;
            })
        );
    }

    getCart(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`${this.apiRoot}/cart/`).pipe(
            map((data: CartItem[]) => {
                this.currentCartItems = data;
                this.cartItemsSubject.next(data);
                return data;
            })
        );
    }

    removeItemFromCart(item: CartItem): Observable<CartItem[]> {
        const params = new HttpParams().set('item_pk', item.fk_item);
        return this.http.delete<CartItem[]>(`${this.apiRoot}/cart/remove-item`, { params }).pipe(
            map((data: CartItem[]) => {
                this.currentCartItems = data;
                this.cartItemsSubject.next(data);
                return data;
            })
        );
    }

    orderCart(): Observable<CartItem[]> {
        return this.http.post<CartItem[]>(`${this.apiRoot}/orders/order-cart`, null).pipe(
            map((data: CartItem[]) => {
                this.currentCartItems = data;
                this.cartItemsSubject.next(data);
                return data;
            })
        );
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiRoot}/orders/`).pipe(
            map((order: Order[]) => {
                this.currentOrderItems = order;
                this.orderItemsSubject.next(order);
                return order;
            })
        );
    }

    getOrderDetails(pk: number): Observable<OrderDetails> {
        const params = new HttpParams().set('order_id', pk);
        return this.http.get<OrderDetails>(`${this.apiRoot}/orders/details`, { params: params });
    }
}
