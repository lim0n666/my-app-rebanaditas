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
  // ARREGLO DE PRODUCTOS
  // ==========================================

  private listaProductos: Producto[] = [

    {
      id: 1,
      nombre: 'Arroz con leche',
      precio: 35,
      categoria: 'Postres',
      imagen: 'assets/icon/favicon.png',
      descripcion: 'Tradicional y cremoso con canela.'
    },

    {
      id: 2,
      nombre: 'Pay de limón',
      precio: 40,
      categoria: 'Postres',
      imagen: 'assets/icon/favicon.png',
      descripcion: 'Fresco con base crujiente.'
    },

    {
      id: 3,
      nombre: 'Pastel de chocolate',
      precio: 45,
      categoria: 'Pasteles',
      imagen: 'assets/icon/favicon.png',
      descripcion: 'Húmedo con doble capa de fudge.'
    }

  ];


  // ==========================================
  // ARREGLO DE CATEGORÍAS
  // ==========================================

  private categorias: string[] = [

    'Todos',
    'Postres',
    'Pasteles',
    'Bebidas'

  ];


  // ==========================================
  // ARREGLO DEL CARRITO
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

    return this.categorias;

  }


  // ==========================================
  // OBTENER CARRITO
  // ==========================================

  getCarrito(): ItemCarrito[] {

    return this.carrito;

  }


  // ==========================================
  // AGREGAR AL CARRITO
  // ==========================================

  agregarAlCarrito(producto: Producto): void {

    const itemExistente = this.carrito.find(

      item =>
        item.producto.id === producto.id

    );


    if (itemExistente) {

      itemExistente.cantidad++;

    } else {

      this.carrito.push({

        producto: producto,

        cantidad: 1

      });

    }

  }

}