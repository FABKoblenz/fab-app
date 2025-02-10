import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    apiRoot = environment.baseUrl;
    http: HttpClient = inject(HttpClient);

    constructor() {}

    getItems(): Observable<Item[]> {
        return this.http.get<Item[]>(`${this.apiRoot}/items/`);
    }
}
