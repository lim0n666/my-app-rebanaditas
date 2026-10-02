import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonButton
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class DetalleProductoPage {

  producto: Producto | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    // Buscamos el producto dentro del arreglo del DataService
    this.producto = this.dataService
      .getProductos()
      .find(producto => producto.id === id);
  }

  regresar(): void {
    this.router.navigate(['/home']);
  }

  agregarAlCarrito(): void {
    if (!this.producto) {
      return;
    }

    this.dataService.agregarAlCarrito(this.producto);

    this.router.navigate(['/carrito']);
  }
}