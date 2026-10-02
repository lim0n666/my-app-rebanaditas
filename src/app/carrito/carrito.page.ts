import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton
} from '@ionic/angular';

import { ItemCarrito } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class CarritoPage {

  carrito: ItemCarrito[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carrito = this.dataService.getCarrito();
  }

  regresar(): void {
    this.router.navigate(['/home']);
  }

  aumentarCantidad(item: ItemCarrito): void {
    item.cantidad++;
  }

  disminuirCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      const indice = this.carrito.indexOf(item);

      if (indice !== -1) {
        this.carrito.splice(indice, 1);
      }
    }
  }

  obtenerTotal(): number {
    return this.carrito.reduce(
      (total, item) =>
        total + item.producto.precio * item.cantidad,
      0
    );
  }
}