import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonInput
} from '@ionic/angular';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput
  ]
})
export class MetodosPagoPage {

  metodoSeleccionado = '';

  numeroTarjeta = '';
  nombreTitular = '';
  fechaVencimiento = '';
  cvv = '';

  mensajeError = '';

  constructor(
    private router: Router
  ) {}

  seleccionarMetodo(metodo: string): void {
    this.metodoSeleccionado = metodo;
    this.mensajeError = '';
  }

  regresar(): void {
    this.router.navigate(['/carrito']);
  }

  confirmarCompra(): void {
    this.mensajeError = '';

    if (this.metodoSeleccionado === '') {
      this.mensajeError =
        'Selecciona un método de pago.';
      return;
    }

    if (this.metodoSeleccionado === 'Tarjeta') {

      if (
        this.numeroTarjeta.trim() === '' ||
        this.nombreTitular.trim() === '' ||
        this.fechaVencimiento.trim() === '' ||
        this.cvv.trim() === ''
      ) {
        this.mensajeError =
          'Completa todos los datos de la tarjeta.';
        return;
      }

      if (this.numeroTarjeta.replace(/\s/g, '').length !== 16) {
        this.mensajeError =
          'El número de tarjeta debe tener 16 dígitos.';
        return;
      }

      if (this.cvv.length !== 3) {
        this.mensajeError =
          'El CVV debe tener 3 dígitos.';
        return;
      }
    }

    alert(
      'Compra confirmada. Gracias por comprar en Postres que enamoran.'
    );
  }
}