import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { IonHeader, IonItem, IonLabel, IonToolbar, IonTitle, IonList, IonNote, IonContent, IonThumbnail, IonButton } from '@ionic/angular';

import { ItemCarrito } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonButton,
    CommonModule,
    IonHeader,
    IonItem,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonList,
    IonNote,
    IonContent,
    IonThumbnail]
})
export class CarritoPage implements OnInit {

  carrito: ItemCarrito[] = [];

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private dataService: DataService,
     
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {}

  ngOnInit(): void {

    this.carrito =
      this.dataService.getCarrito();

  }

  regresar(): void {

    this.router.navigate([
      '/home'
    ]);

  }

  irAMetodosPago(): void {

    this.router.navigate([
      '/metodos-pago'
    ]);

  }

  aumentarCantidad(
    item: ItemCarrito
  ): void {

    item.cantidad++;

  }

  disminuirCantidad(
    item: ItemCarrito
  ): void {

    if (item.cantidad > 1) {

      item.cantidad--;

    } else {

      const indice =
        this.carrito.indexOf(item);

      if (indice !== -1) {

        this.carrito.splice(
          indice,
          1
        );

      }

    }

  }

  obtenerTotal(): number {

    return this.carrito.reduce(
      (
        total,
        item
      ) =>
        total +
        item.producto.precio *
        item.cantidad,
      0
    );

  }

}