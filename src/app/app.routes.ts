import { Routes } from '@angular/router';

export const routes: Routes = [

  // Página principal
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },

  // Productos
  {
    path: 'productos',
    loadComponent: () =>
      import('./productos/productos.page').then((m) => m.ProductosPage),
  },

  // Carrito
  {
    path: 'carrito',
    loadComponent: () =>
      import('./carrito/carrito.page').then((m) => m.CarritoPage),
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then((m) => m.LoginPage),
  },

  // Ruta inicial
  {
    path: '',
redirectTo: 'login',
    pathMatch: 'full',
  },
{
  path: 'detalle-producto/:id',
  loadComponent: () =>
    import('./detalle-producto/detalle-producto.page')
      .then((m) => m.DetalleProductoPage),
},
  // Cualquier ruta que no exista
  {
    path: '**',
    redirectTo: 'home',
  },
  {
    path: 'detalle-producto',
    loadComponent: () => import('./detalle-producto/detalle-producto.page').then( m => m.DetalleProductoPage)
  }

];