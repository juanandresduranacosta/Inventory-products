import { Routes } from '@angular/router';
import { authGuard } from '../../3.transversal/3.3.guard/auth.guard';

export const routes: Routes = [{
    'path': '', 
    loadComponent: () => import('./../../1.view/1.1.pages/start.page/start.page'),
    canActivate: [authGuard]
},{
    'path': 'login', 
    loadComponent: () => import('./../../1.view/1.1.pages/login.page/login.page')
},{
    path: 'products',
    children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
    },{
        path: 'list',
        loadComponent: () => import('../../1.view/1.1.pages/products.page/products.page.list/products.page.list'),
        canActivate: [authGuard]
    }]
},{ 
    path: '**', 
    redirectTo: '' 
}];