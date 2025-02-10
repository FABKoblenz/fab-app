import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
    tax_category: string;
    name: string;
    price: number;
    pk: number;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    apiRoot = '/api/v1';
    http: HttpClient = inject(HttpClient);

    constructor() {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiRoot}/items/`);
    }
}
