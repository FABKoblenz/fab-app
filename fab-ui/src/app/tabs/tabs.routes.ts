import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { canActivateAuthRole } from '../shared/auth';

export const routes: Routes = [
    {
        path: 'fab',
        component: TabsPage,
        children: [
            {
                path: 'login',
                loadComponent: () => import('../login/login.page').then((m) => m.LoginPage),
            },
            {
                path: 'items',
                loadComponent: () => import('../items/items.page').then((m) => m.ItemsPage),
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'cart',
                loadComponent: () => import('../cart/cart.page').then((m) => m.CartPage),
                canActivate: [canActivateAuthRole],
            },
            {
                path: 'orders',
                loadComponent: () => import('../orders/orders.page').then((m) => m.OrdersPage),
                canActivate: [canActivateAuthRole],
            },
            {
                path: '',
                redirectTo: '/fab/login',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/fab/login',
        pathMatch: 'full',
    },
];
