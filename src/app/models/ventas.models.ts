export interface VentaDetalle {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Venta {
metodoPago: any;
  id: string;
  fecha: string; // ISO 8601
  items: VentaDetalle[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'cancelada';
}