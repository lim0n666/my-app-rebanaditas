// MODIFICADO: historial CRUD persistido en localStorage, con fechas e importes.
import { Injectable } from '@angular/core';
import { ItemCarrito } from '../models/producto.models';
import { Venta, VentaDetalle } from '../models/ventas.models';

@Injectable({ providedIn: 'root' })
export class HistorialVentasService {
  private readonly storageKey = 'rebanaditas.historial.v1';
  private readonly ivaRate = 0.16;

  listar(): Venta[] {
    try {
      const data: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(data)
        ? (data as Venta[]).sort((a, b) => b.fecha.localeCompare(a.fecha))
        : [];
    } catch {
      return [];
    }
  }

  registrarCompra(
    itemsCarrito: ItemCarrito[],
    metodoPago: string,
    estadoInicial: Venta['estado'] = 'pendiente'
  ): Venta {
    const items: VentaDetalle[] = itemsCarrito.map(item => {
      const precioUnitario = this.redondear(item.producto.precio);
      const cantidad = Math.max(1, Math.floor(item.cantidad));
      return {
        productoId: item.producto.id,
        nombre: item.producto.nombre,
        precioUnitario,
        cantidad,
        subtotal: this.redondear(precioUnitario * cantidad)
      };
    });
    const subtotal = this.redondear(items.reduce((total, item) => total + item.subtotal, 0));
    const iva = this.redondear(subtotal * this.ivaRate);
    const venta: Venta = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      items,
      subtotal,
      iva,
      total: this.redondear(subtotal + iva),
      estado: estadoInicial,
      metodoPago
    };
    this.guardar(venta);
    return venta;
  }

  guardar(venta: Venta): void {
    const ventas = this.listar().filter(actual => actual.id !== venta.id);
    this.persistir([...ventas, venta]);
  }

  actualizar(ventaActualizada: Venta): void {
    const ventas = this.listar();
    const indice = ventas.findIndex(venta => venta.id === ventaActualizada.id);
    if (indice === -1) throw new Error('No se encontró la compra que intentas editar.');
    ventas[indice] = ventaActualizada;
    this.persistir(ventas);
  }

  eliminar(id: string): void {
    this.persistir(this.listar().filter(venta => venta.id !== id));
  }

  filtrar(desde?: string, hasta?: string): Venta[] {
    return this.listar().filter(venta => {
      const fecha = venta.fecha.slice(0, 10);
      return (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    });
  }

  recalcularImportes(items: VentaDetalle[]): Pick<Venta, 'subtotal' | 'iva' | 'total'> {
    const subtotal = this.redondear(items.reduce((total, item) => total + item.subtotal, 0));
    const iva = this.redondear(subtotal * this.ivaRate);
    return { subtotal, iva, total: this.redondear(subtotal + iva) };
  }

  private persistir(ventas: Venta[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(ventas));
    } catch {
      throw new Error('No se pudo guardar el historial en este navegador.');
    }
  }

  private redondear(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}
