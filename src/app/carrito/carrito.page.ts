import { Component } from '@core/angular';

interface Venta {
  idVenta: string;
  producto: string;
  total: number;
  metodoPago: string;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage {
  // ArrayList de Ventas / Carrito
  listaVentas: Venta[] = [
    { idVenta: 'V-001', producto: 'Pay de Limón', total: 35, metodoPago: 'Efectivo' }
  ];

  constructor() {}
}
