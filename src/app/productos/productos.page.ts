import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput
} from '@ionic/angular';

import { Producto } from '../models/producto.models';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput
  ]
})
export class ProductosPage {

  // ARREGLO ESTÁTICO DE PRODUCTOS
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Pay de Limón',
      precio: 35,
      categoria: 'Pay'
    },
    {
      id: 2,
      nombre: 'Tres Leches',
      precio: 40,
      categoria: 'Pasteles'
    },
    {
      id: 3,
      nombre: 'Cheesecake de Fresa',
      precio: 50,
      categoria: 'Especiales'
    },
    {
      id: 4,
      nombre: 'Brownie con Nuez',
      precio: 30,
      categoria: 'Chocolate'
    }
  ];

  nuevoNombre = '';
nuevoPrecio: number | null = null;
  nuevaCategoria = '';

  agregarProducto(): void {

    if (
  this.nuevoNombre.trim() === '' ||
  this.nuevoPrecio === null ||
  this.nuevoPrecio <= 0
) {
  return;
}

    const nuevoProducto: Producto = {
      id: this.obtenerNuevoId(),
      nombre: this.nuevoNombre.trim(),
      precio: Number(this.nuevoPrecio),
      categoria:
        this.nuevaCategoria.trim() !== ''
          ? this.nuevaCategoria.trim()
          : 'General'
    };

    // Agregar elemento al arreglo
    this.productos.push(nuevoProducto);

    // Limpiar formulario
    this.nuevoNombre = '';
this.nuevoPrecio = null;
    this.nuevaCategoria = '';
  }

  obtenerNuevoId(): number {

    if (this.productos.length === 0) {
      return 1;
    }

    return (
      Math.max(
        ...this.productos.map(producto => producto.id)
      ) + 1
    );
  }

  eliminarProducto(indice: number): void {

    // Eliminar elemento del arreglo
    this.productos.splice(indice, 1);
  }
}