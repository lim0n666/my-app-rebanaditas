import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import { Venta, VentaDetalle } from '../models/ventas.models';
import { HistorialVentasService } from '../services/historial-ventas.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class HistorialComprasPage {
  private readonly historial = inject(HistorialVentasService);
  private readonly cd = inject(ChangeDetectorRef);

  ventas: Venta[] = [];
  desde = '';
  hasta = '';
  mensaje = '';
  ventaEditandoId: string | null = null;
  fechaEditada = '';
  estadoEditado: Venta['estado'] = 'pendiente';
  itemsEditables: VentaDetalle[] = [];

  async ionViewWillEnter(): Promise<void> {
    await this.historial.cargarDesdePreferences();
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.mensaje = '';
    this.ventas = [...this.historial.filtrar(this.desde, this.hasta)];
    this.cd.detectChanges();
  }

  limpiarFiltros(): void {
    this.desde = '';
    this.hasta = '';
    this.mensaje = '';
    this.ventaEditandoId = null;
    this.ventas = [...this.historial.listar()];
    this.cd.detectChanges();
  }

  iniciarEdicion(venta: Venta): void {
    this.ventaEditandoId = venta.id;
    this.fechaEditada = venta.fecha.slice(0, 10);
    this.estadoEditado = venta.estado;
    this.itemsEditables = venta.items.map(item => ({ ...item }));
    this.mensaje = '';
  }

  actualizarCantidad(item: VentaDetalle): void {
    const cantidad = Number(item.cantidad);
    if (Number.isInteger(cantidad) && cantidad > 0) {
      item.subtotal = Math.round(item.precioUnitario * cantidad * 100) / 100;
    }
  }

  guardarEdicion(venta: Venta): void {
    if (!this.fechaEditada || this.itemsEditables.length === 0) {
      this.mensaje = 'La compra debe tener fecha y al menos un producto.';
      return;
    }
    if (this.itemsEditables.some(item => !Number.isInteger(Number(item.cantidad)) || Number(item.cantidad) <= 0)) {
      this.mensaje = 'Cada cantidad debe ser un número entero mayor que cero.';
      return;
    }

    try {
      const items = this.itemsEditables.map(item => ({
        ...item,
        cantidad: Number(item.cantidad),
        subtotal: Math.round(item.precioUnitario * Number(item.cantidad) * 100) / 100
      }));
      const importes = this.historial.recalcularImportes(items);
      this.historial.actualizar({
        ...venta,
        fecha: new Date(this.fechaEditada + 'T12:00:00').toISOString(),
        estado: this.estadoEditado,
        items,
        ...importes
      });
      this.ventaEditandoId = null;
      this.cargarVentas();
      this.mensaje = 'Compra actualizada.';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'No se pudo actualizar la compra.';
    }
  }

  cancelarEdicion(): void {
    this.ventaEditandoId = null;
    this.itemsEditables = [];
    this.mensaje = '';
  }

  eliminarVenta(venta: Venta): void {
    if (!window.confirm('¿Eliminar esta compra del historial?')) return;
    try {
      this.historial.eliminar(venta.id);
      this.cargarVentas();
      this.mensaje = 'Compra eliminada del historial.';
    } catch (error) {
      this.mensaje = error instanceof Error ? error.message : 'No se pudo eliminar la compra.';
    }
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha));
  }
}