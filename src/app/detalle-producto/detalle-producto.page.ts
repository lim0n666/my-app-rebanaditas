import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  ToastController // <--- 1. Importar ToastController
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton
  ]
})
export class DetalleProductoPage {

  producto: Producto | undefined;
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private toastController: ToastController // <--- 2. Inyectar ToastController
  ) {}

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.producto =
      this.dataService
        .getProductos()
        .find(
          producto => producto.id === id
        );
  }

  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  async agregarAlCarrito(): Promise<void> {
    if (!this.producto) {
      return;
    }

    // 3. Guardamos en el servicio
    this.dataService.agregarAlCarrito(
      this.producto,
      this.cantidad
    );

    // 4. Eliminamos la redirección a /carrito y en su lugar mostramos un Toast
    const toast = await this.toastController.create({
      message: `¡Se agregaron ${this.cantidad} producto(s) al carrito!`,
      duration: 2000, // Se quita solo después de 2 segundos
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
  }
}