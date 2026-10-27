import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Importamos todas las etiquetas que usamos en el HTML del detalle
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  ToastController
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  // Añadimos las etiquetas al arreglo para que Angular las reconozca
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class DetalleProductoPage implements OnInit {
  // ... mantén toda tu lógica de la clase, el constructor y el Toast exactamente igual

  producto: Producto | undefined;
  cantidad: number = 1;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private route: ActivatedRoute,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private dataService: DataService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
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