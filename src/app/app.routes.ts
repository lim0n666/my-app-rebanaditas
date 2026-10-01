import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos', // Redirige automáticamente a productos
    pathMatch: 'full',
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then( m => m.ProductosPage)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito.page').then( m => m.CarritoPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
];