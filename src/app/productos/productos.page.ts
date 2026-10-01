import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonButton, IonInput, 
  IonCard, IonItemSliding 
} from '@ionic/angular';

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
    IonInput,
    IonCard,
    IonItemSliding
  ]
})
export class ProductosPage {
  // Arreglo directo con los datos estáticos
  misPostres = [
    { id: 1, nombre: 'Pay de Limón', precio: 35, categoria: 'Pay' },
    { id: 2, nombre: 'Tres Leches', precio: 40, categoria: 'Pasteles' },
    { id: 3, nombre: 'Cheesecake de Fresa', precio: 50, categoria: 'Especiales' },
    { id: 4, nombre: 'Brownie con Nuez', precio: 30, categoria: 'Chocolate' }
  ];

  // Variables para el formulario
  nuevoNombre: string = '';
  nuevoPrecio: number = 0;
  nuevaCategoria: string = '';

  constructor() {}

  // Método para agregar un producto
  agregarProducto() {
    if (this.nuevoNombre && this.nuevoPrecio > 0) {
      const nuevo = {
        id: this.misPostres.length + 1,
        nombre: this.nuevoNombre,
        precio: Number(this.nuevoPrecio),
        categoria: this.nuevaCategoria || 'General'
      };
      this.misPostres.push(nuevo);
      
      // Limpiar campos
      this.nuevoNombre = '';
      this.nuevoPrecio = 0;
      this.nuevaCategoria = '';
    }
  }

  // Método para eliminar un producto
  eliminarProducto(index: number) {
    this.misPostres.splice(index, 1);
  }
}