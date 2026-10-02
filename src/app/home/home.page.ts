import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonSearchbar
} from '@ionic/angular';

import { Router } from '@angular/router';
import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar
  ]
})
export class HomePage {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  textoBusqueda = '';

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Obtenemos los productos del arreglo del DataService
    this.productos = this.dataService.getProductos();

    // Copiamos el arreglo para mostrar todos inicialmente
    this.productosFiltrados = [...this.productos];
  }

  buscarProducto(event: any): void {
    const texto = event.detail.value?.toLowerCase() || '';

    this.textoBusqueda = texto;

    this.productosFiltrados = this.productos.filter(
      producto =>
        producto.nombre.toLowerCase().includes(texto)
    );
  }

  verProducto(producto: Producto): void {
    this.router.navigate([
      '/detalle-producto',
      producto.id
    ]);
  }
}