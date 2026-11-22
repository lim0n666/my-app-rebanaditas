import { Injectable, inject } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, from } from 'rxjs';
import { Producto } from '../models/producto.models';
import {
  FastFoodApiItem,
  FastFoodApiPayload,
  fromFastFoodItem,
  toFastFoodPayload
} from '../models/fast-food.models';
import { DataService } from './data';

const CATALOGO_KEY = 'rebanaditas.catalogo.hibrido.v2';

@Injectable({ providedIn: 'root' })
export class FastFoodApiService {
  private readonly dataService = inject(DataService);
  private readonly baseUrl = 'https://devsapihub.com/api-fast-food';

  listar(): Observable<Producto[]> {
    return from(this.listarAsync());
  }

  private async listarAsync(): Promise<Producto[]> {
    const locales = await this.obtenerCatalogoLocal();

    try {
      await CapacitorHttp.get({
        url: this.baseUrl,
        connectTimeout: 4000,
        readTimeout: 4000
      });
    } catch {
      // Si la API externa no responde, mantiene catálogo local en Preferences
    }

    return locales;
  }

  obtener(id: number): Observable<Producto> {
    return from(this.obtenerAsync(id));
  }

  private async obtenerAsync(id: number): Promise<Producto> {
    const idBuscado = Number(id);
    const locales = await this.obtenerCatalogoLocal();
    const encontrado = locales.find(p => Number(p.id) === idBuscado);

    if (encontrado) {
      return encontrado;
    }

    const response = await CapacitorHttp.get({
      url: this.baseUrl,
      connectTimeout: 4000,
      readTimeout: 4000
    });

    const items = response.data as FastFoodApiItem[];
    const apiItem = Array.isArray(items) ? items.find(i => Number(i.id) === idBuscado) : undefined;
    if (!apiItem) {
      throw new Error('No se encontró ese producto en el catálogo.');
    }
    return fromFastFoodItem(apiItem);
  }

  porCategoria(category: string): Observable<Producto[]> {
    return from(this.porCategoriaAsync(category));
  }

  private async porCategoriaAsync(category: string): Promise<Producto[]> {
    const slug = category.trim().toLowerCase();
    const equivalencias: Record<string, string> = {
      pastel: 'pasteles', pasteles: 'pasteles',
      dona: 'donas', donas: 'donas',
      galleta: 'galletas', galletas: 'galletas',
      pay: 'pays', pays: 'pays',
      helado: 'helados', helados: 'helados',
      gelatina: 'gelatinas', gelatinas: 'gelatinas',
      brownie: 'brownies', brownies: 'brownies',
      bebida: 'bebidas', bebidas: 'bebidas',
      carlota: 'carlotas', carlotas: 'carlotas'
    };

    const categoriaObjetivo = equivalencias[slug] ?? slug;
    const productos = await this.listarAsync();

    return productos.filter(p => {
      const catProd = (p.categoria ?? '').trim().toLowerCase();
      return (
        catProd === categoriaObjetivo ||
        catProd.includes(categoriaObjetivo) ||
        categoriaObjetivo.includes(catProd)
      );
    });
  }

  crear(producto: Partial<Producto>): Observable<Producto> {
    return from(this.crearAsync(producto));
  }

  private async crearAsync(producto: Partial<Producto>): Promise<Producto> {
    const locales = await this.obtenerCatalogoLocal();
    const nuevoId = locales.length > 0 ? Math.max(...locales.map(p => Number(p.id))) + 1 : 1;

    const nuevoProducto: Producto = {
      id: nuevoId,
      nombre: (producto.nombre ?? 'Nuevo Postre').trim(),
      precio: Number(producto.precio ?? 0),
      categoria: (producto.categoria ?? 'Pasteles').trim(),
      sabor: (producto.sabor ?? 'Especial').trim(),
      descripcion: (producto.descripcion ?? '').trim() || 'Delicioso postre artesanal de Rebanaditas.',
      imagen: (producto.imagen ?? '').trim() || 'assets/productos-imagenes/pastel-de-chocolate.png'
    };

    locales.push(nuevoProducto);
    await this.guardarCatalogoLocal(locales);

    try {
      await CapacitorHttp.post({
        url: this.baseUrl + '/product',
        headers: { 'Content-Type': 'application/json' },
        data: toFastFoodPayload(nuevoProducto)
      });
    } catch {
      // Persiste en Preferences
    }

    return nuevoProducto;
  }

  actualizar(id: number, producto: Partial<Producto>): Observable<Producto> {
    return from(this.actualizarAsync(id, producto));
  }

  private async actualizarAsync(id: number, producto: Partial<Producto>): Promise<Producto> {
    const idNum = Number(id);
    const locales = await this.obtenerCatalogoLocal();
    const index = locales.findIndex(p => Number(p.id) === idNum);

    const actualizado: Producto = {
      id: idNum,
      nombre: (producto.nombre ?? locales[index]?.nombre ?? '').trim(),
      precio: Number(producto.precio ?? locales[index]?.precio ?? 0),
      categoria: (producto.categoria ?? locales[index]?.categoria ?? 'Pasteles').trim(),
      sabor: (producto.sabor ?? locales[index]?.sabor ?? 'Especial').trim(),
      descripcion: (producto.descripcion ?? locales[index]?.descripcion ?? '').trim() || 'Delicioso postre artesanal de Rebanaditas.',
      imagen: (producto.imagen ?? locales[index]?.imagen ?? '').trim() || 'assets/productos-imagenes/pastel-de-chocolate.png'
    };

    if (index !== -1) {
      locales[index] = actualizado;
      await this.guardarCatalogoLocal(locales);
    }

    const payload: FastFoodApiPayload & { id: number } = {
      ...toFastFoodPayload(actualizado),
      id: idNum
    };

    try {
      await CapacitorHttp.put({
        url: this.baseUrl + '/product/' + idNum,
        headers: { 'Content-Type': 'application/json' },
        data: payload
      });
    } catch {
      // Persiste en Preferences
    }

    return actualizado;
  }

  eliminar(id: number): Observable<void> {
    return from(this.eliminarAsync(id));
  }

  private async eliminarAsync(id: number): Promise<void> {
    const idNum = Number(id);
    const locales = (await this.obtenerCatalogoLocal()).filter(p => Number(p.id) !== idNum);
    await this.guardarCatalogoLocal(locales);

    try {
      await CapacitorHttp.delete({
        url: this.baseUrl + '/product/' + idNum
      });
    } catch {
      // Persiste en Preferences
    }
  }

  private async obtenerCatalogoLocal(): Promise<Producto[]> {
    try {
      const { value } = await Preferences.get({ key: CATALOGO_KEY });
      if (value) {
        const parsed = JSON.parse(value) as Producto[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Usa base de DataService
    }

    const base = [...this.dataService.getProductos()];
    await this.guardarCatalogoLocal(base);
    return base;
  }

  private async guardarCatalogoLocal(productos: Producto[]): Promise<void> {
    await Preferences.set({
      key: CATALOGO_KEY,
      value: JSON.stringify(productos)
    });
  }
}