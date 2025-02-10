import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Welcome {
    tax_category: TaxCategory;
    name: string;
    price: number;
    pk: number;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    http: HttpClient = inject(HttpClient);

    constructor() {}

    getItems(): {};
}
