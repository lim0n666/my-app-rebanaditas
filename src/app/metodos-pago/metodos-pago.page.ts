import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  IonInput,
  IonLabel,
  IonIcon
} from '@ionic/angular';
import { DataService } from '../services/data';
import { HistorialVentasService } from '../services/historial-ventas.service';
import { StripeApiService } from '../services/stripe-api.service';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon,
    IonLabel,
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
  private readonly data = inject(DataService);
  private readonly historial = inject(HistorialVentasService);
  private readonly stripeApi = inject(StripeApiService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);

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

  constructor() {
    addIcons({
      cashOutline,
      cardOutline,
      swapHorizontalOutline
    });
  }

  ionViewWillEnter(): void {
    this.mensajeError = '';
    this.estadoPago = '';
    this.folioRecibo = '';
    this.procesando = false;
  }

  async confirmarCompra(): Promise<void> {
    const carrito = this.data.getCarrito();
    if (!carrito.length) {
      this.mensajeError = 'Tu carrito está vacío.';
      return;
    }

    this.mensajeError = '';
    this.folioRecibo = '';

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

    this.procesando = true;
    this.estadoPago = 'PENDIENTE - Conectando con API de pago...';
    this.cd.detectChanges();

    const subtotal = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const totalConIva = Math.round(subtotal * 1.16 * 100) / 100;

    if (this.metodoSeleccionado === 'Tarjeta Sandbox') {
      const resultadoStripe = await this.stripeApi.crearIntentoPago(
        totalConIva,
        `Pedido Rebanaditas - ${this.titularTarjeta.trim()}`,
        this.numeroTarjeta
      );

      if (!resultadoStripe.exito) {
        this.procesando = false;
        this.estadoPago = `FALLO (${resultadoStripe.estado}) - Pago rechazado.`;
        this.mensajeError = resultadoStripe.mensaje;
        this.cd.detectChanges();
        return;
      }

      this.folioRecibo = resultadoStripe.idTransaccion;
      this.estadoPago = `ÉXITO - Stripe (${resultadoStripe.estado})`;
      this.historial.registrarCompra(
        carrito,
        `Stripe Card (${resultadoStripe.idTransaccion})`,
        'pagada'
      );
      this.data.vaciarCarrito();
      this.procesando = false;
      this.cd.detectChanges();

      setTimeout(() => {
        void this.router.navigateByUrl('/historial-compras');
      }, 900);
      return;
    }

    // Flujo para Efectivo o Transferencia / Mercado Pago
    setTimeout(() => {
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
      this.cd.detectChanges();

      setTimeout(() => {
        void this.router.navigateByUrl('/historial-compras');
      }, 900);
    }, 600);
  }

  volverAlCarrito(): void {
    void this.router.navigateByUrl('/carrito');
  }
}