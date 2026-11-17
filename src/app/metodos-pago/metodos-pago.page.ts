import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cashOutline, cardOutline, swapHorizontalOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonNote,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput, IonLabel, IonIcon } from '@ionic/angular';
import { DataService } from '../services/data';
import { HistorialVentasService } from '../services/historial-ventas.service';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, 
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonNote,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput
  ]
})
export class MetodosPagoPage {
  constructor() {
    addIcons({
      cashOutline,
      cardOutline,
      swapHorizontalOutline
    });
  }

  metodoSeleccionado = 'Efectivo';
  titularTarjeta = '';
  numeroTarjeta = '4242 4242 4242 4242';
  expiracionTarjeta = '12/28';
  cvvTarjeta = '123';
  referenciaTransferencia = 'MP-2026001';

  mensajeError = '';
  estadoPago = '';
  folioRecibo = '';
  procesando = false;

  private readonly data = inject(DataService);
  private readonly historial = inject(HistorialVentasService);
  private readonly router = inject(Router);

  confirmarCompra(): void {
    const carrito = this.data.getCarrito();
    if (!carrito.length) {
      this.mensajeError = 'Tu carrito está vacío.';
      return;
    }

    this.mensajeError = '';
    this.folioRecibo = '';

    // Validaciones según el método elegido
    if (this.metodoSeleccionado === 'Tarjeta Sandbox') {
      const limpia = this.numeroTarjeta.replace(/\s+/g, '');
      if (!this.titularTarjeta.trim()) {
        this.mensajeError = 'Ingresa el nombre del titular de la tarjeta.';
        return;
      }
      if (limpia.length < 16 || !this.expiracionTarjeta.trim() || this.cvvTarjeta.trim().length < 3) {
        this.mensajeError = 'Completa correctamente los datos de la tarjeta sandbox.';
        return;
      }
    }

    if (this.metodoSeleccionado === 'Transferencia / Mercado Pago' && !this.referenciaTransferencia.trim()) {
      this.mensajeError = 'Ingresa la referencia o folio de tu transferencia.';
      return;
    }

    // Estado 1: Pendiente (conectando con pasarela sandbox)
    this.procesando = true;
    this.estadoPago = 'PENDIENTE - Validando con pasarela sandbox...';

    setTimeout(() => {
      // Simulación de tarjeta rechazada (Fallo) para cumplir la rúbrica
      if (
        this.metodoSeleccionado === 'Tarjeta Sandbox' &&
        this.numeroTarjeta.replace(/\s+/g, '').startsWith('4000')
      ) {
        this.procesando = false;
        this.estadoPago = 'FALLO - Tarjeta declinada por el banco emisor (Sandbox).';
        this.mensajeError = 'El pago fue rechazado. Prueba con la tarjeta 4242 4242 4242 4242.';
        return;
      }

      // Estado 2: Éxito + Generación de folio de recibo
      const folio = 'REB-' + Math.floor(100000 + Math.random() * 900000);
      this.folioRecibo = folio;
      this.estadoPago = 'ÉXITO - Pago confirmado.';

      const esPagoInmediato = this.metodoSeleccionado !== 'Efectivo';
      const descripcionMetodo = `${this.metodoSeleccionado} (Folio: ${folio})`;

      this.historial.registrarCompra(
        carrito,
        descripcionMetodo,
        esPagoInmediato ? 'pagada' : 'pendiente'
      );

      this.data.vaciarCarrito();
      this.procesando = false;

      setTimeout(() => {
        void this.router.navigateByUrl('/historial-compras');
      }, 900);
    }, 800);
  }

  volverAlCarrito(): void {
    void this.router.navigateByUrl('/carrito');
  }
}
