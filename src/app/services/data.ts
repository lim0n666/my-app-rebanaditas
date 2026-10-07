import { Injectable } from '@angular/core';

import {
  Producto,
  ItemCarrito,
  Usuario
} from '../models/producto.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // ==========================================
  // ADMINISTRADOR
  // ==========================================

  private administrador: Usuario = {
    id: 0,
    nombre: 'Administrador',
    correo: 'admin@rebanaditas.com',
    password: 'admin123'
  };

  // ==========================================
  // ARREGLO DE PRODUCTOS
  // ==========================================

  private listaProductos: Producto[] = [

    {
      id: 1,
      nombre: 'Arroz con leche',
      precio: 35,
      categoria: 'Helados',
      sabor: 'Canela',
      imagen: 'assets/productos/arroz con leche (1).png',
      descripcion:
        'Tradicional y cremoso con un delicioso toque de canela.'
    },

    {
      id: 2,
      nombre: 'Pay de limón',
      precio: 40,
      categoria: 'Pays',
      sabor: 'Limón',
      imagen: 'assets/productos/pay de limon (1).png',
      descripcion:
        'Fresco con base crujiente y un delicioso sabor a limón.'
    },

    {
      id: 3,
      nombre: 'Pastel de chocolate',
      precio: 45,
      categoria: 'Pasteles',
      sabor: 'Chocolate',
      imagen: 'assets/productos/pastel de chocolate (1).png',
      descripcion:
        'Húmedo y delicioso con un intenso sabor a chocolate.'
    },

    {
      id: 4,
      nombre: 'Cheesecake de fresa',
      precio: 50,
      categoria: 'Pasteles',
      sabor: 'Fresa',
      imagen: 'assets/productos/cheesecake de fresa (1).png',
      descripcion:
        'Cremoso cheesecake acompañado de fresas.'
    },

    {
      id: 5,
      nombre: 'Flan napolitano',
      precio: 38,
      categoria: 'Pasteles',
      sabor: 'Vainilla',
      imagen: 'assets/productos/flan napolitano (1).png',
      descripcion:
        'Suave y cremoso con una deliciosa capa de caramelo.'
    },

    {
      id: 6,
      nombre: 'Pastel de browmie',
      precio: 30,
      categoria: 'Pasteles',
      sabor: 'Chocolate',
      imagen: 'assets/productos/brownie (1).png',
      descripcion:
        'Delicioso pastel de brownie de chocolate con una textura suave.'
    },

    {
      id: 7,
      nombre: 'Pastel de tres leches',
      precio: 45,
      categoria: 'Pasteles',
      sabor: 'Vainilla',
      imagen: 'assets/productos/pastel de tres leches (1).png',
      descripcion:
        'Esponjoso pastel bañado en una deliciosa mezcla de tres leches.'
    },

    {
      id: 8,
      nombre: 'Chocoflan',
      precio: 48,
      categoria: 'Pasteles',
      sabor: 'Chocolate',
      imagen: 'assets/productos/chocoflan (1).png',
      descripcion:
        'Deliciosa combinación de pastel de chocolate y flan.'
    },

    {
      id: 9,
      nombre: 'Fresas con crema',
      precio: 40,
      categoria: 'Helados',
      sabor: 'Fresa',
      imagen: 'assets/productos/fresas con crema (1).png',
      descripcion:
        'Fresas frescas acompañadas de una cremosa preparación.'
    },

    {
      id: 10,
      nombre: 'Pastel de fresa',
      precio: 50,
      categoria: 'Pasteles',
      sabor: 'Fresa',
      imagen: 'assets/productos/pastel de fresa (1).png',
      descripcion:
        'Delicioso pastel decorado con fresas y crema.'
    },
    // ==========================================
  // HELADOS (5 productos)
  // ==========================================
  {
    id: 11,
    nombre: 'Helado artesanal de vainilla',
    precio: 35,
    categoria: 'Helados',
    sabor: 'Vainilla',
    imagen: 'assets/productos/helado_vainilla.jpg',
    descripcion: 'Cremoso helado elaborado con vainilla natural de Papantla.'
  },
  {
    id: 12,
    nombre: 'Helado de chocolate oscuro',
    precio: 40,
    categoria: 'Helados',
    sabor: 'Chocolate',
    imagen: 'assets/productos/helado_chocolate.jpg',
    descripcion: 'Intenso helado de chocolate semi-amargo con trocitos de cacao.'
  },
  {
    id: 13,
    nombre: 'Nieve de mango con chamoy',
    precio: 35,
    categoria: 'Helados',
    sabor: 'Mango',
    imagen: 'assets/productos/helado_mango.jpg',
    descripcion: 'Refrescante nieve de mango natural acompañada de un toque de chamoy.'
  },
  {
    id: 14,
    nombre: 'Helado de galleta Oreo',
    precio: 45,
    categoria: 'Helados',
    sabor: 'Galleta',
    imagen: 'assets/productos/helado_oreo.jpg',
    descripcion: 'Deliciosa base de crema con generosos trozos crujientes de galleta Oreo.'
  },
  {
    id: 15,
    nombre: 'Helado de pistache',
    precio: 48,
    categoria: 'Helados',
    sabor: 'Pistache',
    imagen: 'assets/productos/helado_pistache.jpg',
    descripcion: 'Exquisito helado artesanal con auténticos trocitos de pistache tostado.'
  },

  // ==========================================
  // GELATINAS (5 productos)
  // ==========================================
  {
    id: 16,
    nombre: 'Gelatina mosaico cremosa',
    precio: 30,
    categoria: 'Gelatinas',
    sabor: 'Frutas variadas',
    imagen: 'assets/productos/gelatina_mosaico.jpg',
    descripcion: 'Clásica gelatina de cubitos de colores sobre una rica base de tres leches.'
  },
  {
    id: 17,
    nombre: 'Gelatina de fresa',
    precio: 28,
    categoria: 'Gelatinas',
    sabor: 'Fresa',
    imagen: 'assets/productos/gelatina_fresa.jpg',
    descripcion: 'Suave gelatina de sabor fresa dulce.'
  },
  {
    id: 18,
    nombre: 'Gelatina de café capuchino',
    precio: 32,
    categoria: 'Gelatinas',
    sabor: 'Café',
    imagen: 'assets/productos/gelatina_cafe.jpg',
    descripcion: 'Deliciosa gelatina con un toque aromático de café y veta de cajeta.'
  },
  {
    id: 19,
    nombre: 'Gelatina de rompope',
    precio: 35,
    categoria: 'Gelatinas',
    sabor: 'Rompope',
    imagen: 'assets/productos/gelatina_rompope.jpg',
    descripcion: 'Tradicional gelatina sabor rompope con un toque ligero de canela.'
  },
  {
    id: 20,
    nombre: 'Gelatina cristalina de frutas',
    precio: 30,
    categoria: 'Gelatinas',
    sabor: 'Frutos tropicales',
    imagen: 'assets/productos/gelatina_frutas.jpg',
    descripcion: 'Refrescante gelatina transparente rellena de trozos de durazno y piña.'
  },

  // ==========================================
  // BROWNIES (5 productos)
  // ==========================================
  {
    id: 21,
    nombre: 'Brownie clásico de chocolate',
    precio: 38,
    categoria: 'Brownies',
    sabor: 'Chocolate',
    imagen: 'assets/productos/brownie_clasico.jpg',
    descripcion: 'Esponjoso por dentro y con una capa crujiente perfecta por fuera.'
  },
  {
    id: 22,
    nombre: 'Brownie con nuez',
    precio: 42,
    categoria: 'Brownies',
    sabor: 'Chocolate y Nuez',
    imagen: 'assets/productos/brownie_nuez.jpg',
    descripcion: 'Nuestro brownie tradicional enriquecido con trocitos de nuez tostada.'
  },
  {
    id: 23,
    nombre: 'Brownie con relleno de queso crema',
    precio: 45,
    categoria: 'Brownies',
    sabor: 'Chocolate y Queso',
    imagen: 'assets/productos/brownie_cheesecake.jpg',
    descripcion: 'Combinación marmoleada de chocolate intenso y cremoso cheesecake.'
  },
  {
    id: 24,
    nombre: 'Brownie bañado en caramelo',
    precio: 45,
    categoria: 'Brownies',
    sabor: 'Chocolate y Caramelo',
    imagen: 'assets/productos/brownie_caramelo.jpg',
    descripcion: 'Brownie de chocolate fudge decorado con un hilo de caramelo salado.'
  },
  {
    id: 25,
    nombre: 'Brownie cubierto de chocolate blanco',
    precio: 46,
    categoria: 'Brownies',
    sabor: 'Doble Chocolate',
    imagen: 'assets/productos/brownie_blanco.jpg',
    descripcion: 'Delicioso brownie oscuro cubierto con una capa generosa de chocolate blanco.'
  },

  // ==========================================
  // BEBIDAS (5 productos)
  // ==========================================
  {
    id: 26,
    nombre: 'Café americano caliente',
    precio: 30,
    categoria: 'Bebidas',
    sabor: 'Café',
    imagen: 'assets/productos/cafe_americano.jpg',
    descripcion: 'Café de grano recién molido, ideal para acompañar cualquier postre.'
  },
  {
    id: 27,
    nombre: 'Capuchino con canela',
    precio: 45,
    categoria: 'Bebidas',
    sabor: 'Café y Canela',
    imagen: 'assets/productos/capuchino.jpg',
    descripcion: 'Espumoso café con leche espumada y un espolvoreado de canela fina.'
  },
  {
    id: 28,
    nombre: 'Malteada de chocolate',
    precio: 55,
    categoria: 'Bebidas',
    sabor: 'Chocolate',
    imagen: 'assets/productos/malteada_chocolate.jpg',
    descripcion: 'Bebida cremosa batida con helado de chocolate y decorada con crema batida.'
  },
  {
    id: 29,
    nombre: 'Té chai frappé',
    precio: 50,
    categoria: 'Bebidas',
    sabor: 'Chai',
    imagen: 'assets/productos/te_chai.jpg',
    descripcion: 'Refrescante mezcla helada de té chai especiado con leche y hielo frappé.'
  },
  {
    id: 30,
    nombre: 'Limonada mineral con frutos rojos',
    precio: 40,
    categoria: 'Bebidas',
    sabor: 'Frutos rojos',
    imagen: 'assets/productos/limonada.jpg',
    descripcion: 'Agua mineral con jugo de limón fresco y un toque de jarabe de frutos rojos.'
  }

  ];

  // ==========================================
  // ARREGLO DE CLIENTES
  // ==========================================

  private usuarios: Usuario[] = [

    {
      id: 1,
      nombre: 'Reyna',
      correo: 'reyna@gmail.com',
      password: '123456'
    },

    {
      id: 2,
      nombre: 'Cliente',
      correo: 'cliente@gmail.com',
      password: '123456'
    }

  ];

  // ==========================================
  // USUARIO ACTUAL
  // ==========================================

  private usuarioActual: Usuario | undefined;

  // ==========================================
  // CATEGORÍAS
  // ==========================================

  private categorias: string[] = [
    'Pasteles',
    'Carlotas',
    'Pays',
    'Helados',
    'Gelatinas',
    'Brownies',
    'Bebidas'
  ];

  // ==========================================
  // SABORES
  // ==========================================

  private sabores: string[] = [
    'Chocolate',
    'Fresa',
    'Limón',
    'Vainilla',
    'Canela',
    'Mango',
    'Nuez',
    'Café',
    'Galleta',
    'Pistache',
    'Rompope',
    'Frutas variadas',
    'Frutos rojos',
    'Chai',
  ];

  // ==========================================
  // CARRITO
  // ==========================================

  private carrito: ItemCarrito[] = [];

  constructor() {}

  // ==========================================
  // OBTENER PRODUCTOS
  // ==========================================

  getProductos(): Producto[] {

    return this.listaProductos;

  }

  // ==========================================
  // OBTENER CATEGORÍAS
  // ==========================================

  getCategorias(): string[] {
  return [
    'Pasteles',
    'Carlotas',
    'Pays',
    'Helados',
    'Gelatinas',
    'Brownies',
    'Bebidas'
  ];
}
  // ==========================================
  // OBTENER SABORES
  // ==========================================

  getSabores(): string[] {

    return this.sabores;

  }

  // ==========================================
  // OBTENER CARRITO
  // ==========================================

  getCarrito(): ItemCarrito[] {

    return this.carrito;

  }

  // ==========================================
  // OBTENER CLIENTES
  // ==========================================

  getUsuarios(): Usuario[] {

    return this.usuarios;

  }

  // ==========================================
  // OBTENER ADMINISTRADOR
  // ==========================================

  getAdministrador(): Usuario {

    return this.administrador;

  }

  // ==========================================
  // VERIFICAR SI ES ADMINISTRADOR
  // ==========================================

  esAdministrador(
    correo: string,
    password: string
  ): boolean {

    return (
      this.administrador.correo.toLowerCase() ===
        correo.trim().toLowerCase() &&
      this.administrador.password === password
    );

  }

  // ==========================================
  // USUARIO ACTUAL
  // ==========================================

  setUsuarioActual(
    usuario: Usuario
  ): void {

    this.usuarioActual = usuario;

  }

  getUsuarioActual(): Usuario | undefined {

    return this.usuarioActual;

  }

  cerrarSesion(): void {

    this.usuarioActual = undefined;

  }

  // ==========================================
  // SABER SI EL USUARIO ACTUAL ES ADMIN
  // ==========================================

  usuarioEsAdministrador(): boolean {

    if (!this.usuarioActual) {

      return false;

    }

    return (
      this.usuarioActual.correo.toLowerCase() ===
      this.administrador.correo.toLowerCase()
    );

  }

  // ==========================================
  // REGISTRAR CLIENTE
  // ==========================================

  registrarUsuario(
    nombre: string,
    correo: string,
    password: string
  ): boolean {

    // No permitir registrar el correo
    // del administrador

    if (
      correo.trim().toLowerCase() ===
      this.administrador.correo.toLowerCase()
    ) {

      return false;

    }

    // Verificar si el correo ya existe

    const correoExiste =
      this.usuarios.some(
        usuario =>
          usuario.correo.toLowerCase() ===
          correo.trim().toLowerCase()
      );

    if (correoExiste) {

      return false;

    }

    // Crear nuevo cliente

    const nuevoUsuario: Usuario = {

      id:
        this.usuarios.length > 0
          ? Math.max(
              ...this.usuarios.map(
                usuario => usuario.id
              )
            ) + 1
          : 1,

      nombre: nombre.trim(),

      correo: correo.trim(),

      password: password

    };

    // Agregar cliente al arreglo

    this.usuarios.push(
      nuevoUsuario
    );

    return true;

  }

  // ==========================================
  // AGREGAR PRODUCTO
  // ==========================================

  agregarProducto(
    producto: Producto
  ): void {

    this.listaProductos.push(
      producto
    );

  }

  // ==========================================
  // OBTENER NUEVO ID DE PRODUCTO
  // ==========================================

  obtenerNuevoIdProducto(): number {

    if (
      this.listaProductos.length === 0
    ) {

      return 1;

    }

    return (
      Math.max(
        ...this.listaProductos.map(
          producto => producto.id
        )
      ) + 1
    );

  }

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  eliminarProducto(
    id: number
  ): void {

    const indice =
      this.listaProductos.findIndex(
        producto =>
          producto.id === id
      );

    if (indice !== -1) {

      this.listaProductos.splice(
        indice,
        1
      );

    }

  }

  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
  // Buscamos si el producto ya existe en el carrito comparando por su id (accediendo a item.producto.id)
  const index = this.carrito.findIndex(item => item.producto.id === producto.id);
  
  if (index !== -1) {
    // Si ya existe, sumamos la cantidad
    this.carrito[index].cantidad += cantidad;
  } else {
    // Si es nuevo, lo agregamos respetando la estructura de ItemCarrito
    this.carrito.push({
      producto: producto,
      cantidad: cantidad
    });
  }
}

}