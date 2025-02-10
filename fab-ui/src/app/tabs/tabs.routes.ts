import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
    {
        path: 'fab',
        component: TabsPage,
        children: [
            {
                path: 'items',
                loadComponent: () => import('../items/items.page').then((m) => m.ItemsPage),
            },
            {
                path: 'cart',
                loadComponent: () => import('../cart/cart.page').then((m) => m.CartPage),
            },
            {
                path: 'orders',
                loadComponent: () => import('../orders/orders.page').then((m) => m.OrdersPage),
            },
            {
                path: '',
                redirectTo: '/fab/items',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/fab/items',
        pathMatch: 'full',
    },
];
