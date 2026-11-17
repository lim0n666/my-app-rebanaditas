import { Producto } from './producto.models';

export const FAST_FOOD_DESSERT_CATEGORIES = [
  'Pasteles',
  'Carlotas',
  'Pays',
  'Helados',
  'Gelatinas',
  'Brownies',
  'Bebidas'
];

export interface FastFoodApiItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

export interface FastFoodApiPayload {
  name: string;
  price: number;
  image: string;
  category: string;
}

export function fromFastFoodItem(item: FastFoodApiItem, descripcion = ''): Producto {
  const descFinal =
    (descripcion || item.description || '').trim() ||
    `Delicioso ${item.name} artesanal preparado al momento en Rebanaditas.`;

  return {
    id: Number(item.id),
    nombre: item.name,
    precio: Number(item.price),
    categoria: item.category || 'Pasteles',
    sabor: 'Especialidad de la casa',
    descripcion: descFinal,
    imagen: item.image || 'assets/productos/pastel de chocolate (1).png'
  };
}

export function toFastFoodPayload(producto: Partial<Producto>): FastFoodApiPayload {
  return {
    name: (producto.nombre ?? '').trim(),
    price: Number(producto.precio ?? 0),
    image: (producto.imagen ?? '').trim(),
    category: (producto.categoria ?? 'Pasteles').trim()
  };
}