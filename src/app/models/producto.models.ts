export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  imagen?: string;
}


export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}


export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}