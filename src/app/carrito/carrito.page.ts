import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonItem,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonList,
  IonNote,
  IonContent,
  IonThumbnail,
  IonButton,
  IonIcon
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
    IonIcon,
    IonButton,
    IonHeader,
    IonItem,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonList,
    IonNote,
    IonContent,
    IonThumbnail
  ]
})
export class CarritoPage {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);

  carrito: ItemCarrito[] = [...this.dataService.getCarrito()];

  ionViewWillEnter(): void {
    this.actualizarVistaCarrito();
  }

  private actualizarVistaCarrito(): void {
    this.carrito = [...this.dataService.getCarrito()];
    this.cd.detectChanges();
  }

  regresar(): void {
    this.router.navigate(['/home']);
  }

  irAMetodosPago(): void {
    this.router.navigate(['/metodos-pago']);
  }

  aumentarCantidad(item: ItemCarrito): void {
    item.cantidad++;
    this.cd.detectChanges();
  }

  disminuirCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      const carritoReal = this.dataService.getCarrito();
      const indice = carritoReal.indexOf(item);
      if (indice !== -1) {
        carritoReal.splice(indice, 1);
      }
      this.carrito = [...carritoReal];
    }
    this.cd.detectChanges();
  }

  obtenerTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }
}