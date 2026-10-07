import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.page').then(m => m.ProductosPage)
  },
  {
    path: 'metodos-pago',
    loadComponent: () => import('./metodos-pago/metodos-pago.page').then(m => m.MetodosPagoPage)
  },
  // ==========================================
  // GRUPO DE TABS (Contenedor inferior fijo)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./categorias/categorias.page').then(m => m.CategoriasPage)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./carrito/carrito.page').then(m => m.CarritoPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage)
      },
      // MOVEMOS DETALLE AQUÍ ADENTRO:
      {
        path: 'detalle-producto/:id',
        loadComponent: () => import('./detalle-producto/detalle-producto.page').then(m => m.DetalleProductoPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];