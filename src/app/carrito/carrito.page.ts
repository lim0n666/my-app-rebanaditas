import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonButton, IonInput 
} from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
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
export class CarritoPage {
  // Arreglo inicial del carrito
  listaCarrito = [
    { id: 1, producto: 'Pay de Limón', cantidad: 2, precio: 35 },
    { id: 2, producto: 'Tres Leches', cantidad: 1, precio: 40 }
  ];

  // Variables para agregar un producto al carrito
  nuevoProducto: string = '';
  nuevaCantidad: number = 1;
  nuevoPrecio: number = 0;

  constructor() {}

  // Método para agregar un producto al carrito
  agregarAlCarrito() {
    if (this.nuevoProducto && this.nuevoPrecio > 0) {
      const item = {
        id: this.listaCarrito.length + 1,
        producto: this.nuevoProducto,
        cantidad: Number(this.nuevaCantidad) || 1,
        precio: Number(this.nuevoPrecio)
      };
      
      this.listaCarrito.push(item);
      
      // Limpiar campos
      this.nuevoProducto = '';
      this.nuevaCantidad = 1;
      this.nuevoPrecio = 0;
    }
  }

  // Método para eliminar un elemento del carrito por índice
  eliminarDelCarrito(index: number) {
    this.listaCarrito.splice(index, 1);
  }

  // Método opcional para calcular el costo total del carrito
  calcularTotal(): number {
    return this.listaCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }
}