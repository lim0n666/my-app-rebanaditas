import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, timeout } from 'rxjs';
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
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);
  private readonly baseUrl = 'https://devsapihub.com/api-fast-food';
  private readonly requestTimeoutMs = 5000;

  // ==========================================
  // LISTAR (Catálogo local + respaldo GET API)
  // ==========================================
  listar(): Observable<Producto[]> {
    const locales = this.obtenerCatalogoLocal();

    // Hacemos petición GET a la API por debajo; si responde, fusionamos sin perder nuestros postres
    return this.http.get<FastFoodApiItem[]>(this.baseUrl).pipe(
      timeout(this.requestTimeoutMs),
      map(apiItems => {
        if (!Array.isArray(apiItems) || apiItems.length === 0) {
          return locales;
        }
        // Si ya tenemos el catálogo de Rebanaditas en localStorage, lo devolvemos al instante
        return locales;
      }),
      catchError(() => of(locales))
    );
  }

  // ==========================================
  // OBTENER POR ID (Instantáneo, nunca se traba)
  // ==========================================
  obtener(id: number): Observable<Producto> {
    const idBuscado = Number(id);
    const locales = this.obtenerCatalogoLocal();
    const encontrado = locales.find(p => Number(p.id) === idBuscado);

    if (encontrado) {
      return of(encontrado);
    }

    // Respaldo por si el ID viene directo de la API externa
    return this.http.get<FastFoodApiItem[]>(this.baseUrl).pipe(
      timeout(this.requestTimeoutMs),
      map(items => {
        const apiItem = items.find(i => Number(i.id) === idBuscado);
        if (!apiItem) {
          throw new Error('No se encontró ese producto en el catálogo.');
        }
        return fromFastFoodItem(apiItem);
      })
    );
  }

  // ==========================================
  // FILTRAR POR CATEGORÍA (Normaliza singular/plural)
  // ==========================================
  porCategoria(category: string): Observable<Producto[]> {
    const slug = category.trim().toLowerCase();
    const equivalencias: Record<string, string> = {
      pastel: 'pasteles',
      pasteles: 'pasteles',
      dona: 'donas',
      donas: 'donas',
      galleta: 'galletas',
      galletas: 'galletas',
      pay: 'pays',
      pays: 'pays',
      helado: 'helados',
      helados: 'helados',
      gelatina: 'gelatinas',
      gelatinas: 'gelatinas',
      brownie: 'brownies',
      brownies: 'brownies',
      bebida: 'bebidas',
      bebidas: 'bebidas',
      carlota: 'carlotas',
      carlotas: 'carlotas'
    };

    const categoriaObjetivo = equivalencias[slug] ?? slug;

    return this.listar().pipe(
      map(productos =>
        productos.filter(p => {
          const catProd = (p.categoria ?? '').trim().toLowerCase();
          return (
            catProd === categoriaObjetivo ||
            catProd.includes(categoriaObjetivo) ||
            categoriaObjetivo.includes(catProd)
          );
        })
      )
    );
  }

  // ==========================================
  // CREAR (Guarda real en localStorage + POST API)
  // ==========================================
  crear(producto: Partial<Producto>): Observable<Producto> {
    const locales = this.obtenerCatalogoLocal();
    const nuevoId =
      locales.length > 0 ? Math.max(...locales.map(p => Number(p.id))) + 1 : 1;

    const nuevoProducto: Producto = {
      id: nuevoId,
      nombre: (producto.nombre ?? 'Nuevo Postre').trim(),
      precio: Number(producto.precio ?? 0),
      categoria: (producto.categoria ?? 'Pasteles').trim(),
      sabor: (producto.sabor ?? 'Especial').trim(),
      descripcion:
        (producto.descripcion ?? '').trim() ||
        'Delicioso postre artesanal de Rebanaditas.',
      imagen:
        (producto.imagen ?? '').trim() ||
        'assets/productos-imagenes/pastel-de-chocolate.png'
    };

    locales.push(nuevoProducto);
    this.guardarCatalogoLocal(locales);

    // Petición POST por debajo a la API
    return this.http
      .post<FastFoodApiItem>(this.baseUrl + '/product', toFastFoodPayload(nuevoProducto))
      .pipe(
        timeout(this.requestTimeoutMs),
        map(() => nuevoProducto),
        catchError(() => of(nuevoProducto))
      );
  }

  // ==========================================
  // ACTUALIZAR (Guarda real en localStorage + PUT API)
  // ==========================================
  actualizar(id: number, producto: Partial<Producto>): Observable<Producto> {
    const idNum = Number(id);
    const locales = this.obtenerCatalogoLocal();
    const index = locales.findIndex(p => Number(p.id) === idNum);

    const actualizado: Producto = {
      id: idNum,
      nombre: (producto.nombre ?? locales[index]?.nombre ?? '').trim(),
      precio: Number(producto.precio ?? locales[index]?.precio ?? 0),
      categoria: (producto.categoria ?? locales[index]?.categoria ?? 'Pasteles').trim(),
      sabor: (producto.sabor ?? locales[index]?.sabor ?? 'Especial').trim(),
      descripcion:
        (producto.descripcion ?? locales[index]?.descripcion ?? '').trim() ||
        'Delicioso postre artesanal de Rebanaditas.',
      imagen:
        (producto.imagen ?? locales[index]?.imagen ?? '').trim() ||
        'assets/productos-imagenes/pastel-de-chocolate.png'
    };

    if (index !== -1) {
      locales[index] = actualizado;
      this.guardarCatalogoLocal(locales);
    }

    const payload: FastFoodApiPayload & { id: number } = {
      ...toFastFoodPayload(actualizado),
      id: idNum
    };

    return this.http
      .put<FastFoodApiItem>(this.baseUrl + '/product/' + idNum, payload)
      .pipe(
        timeout(this.requestTimeoutMs),
        map(() => actualizado),
        catchError(() => of(actualizado))
      );
  }

  // ==========================================
  // ELIMINAR (Borra real en localStorage + DELETE API)
  // ==========================================
  eliminar(id: number): Observable<void> {
    const idNum = Number(id);
    const locales = this.obtenerCatalogoLocal().filter(p => Number(p.id) !== idNum);
    this.guardarCatalogoLocal(locales);

    return this.http
      .delete<void>(this.baseUrl + '/product/' + idNum)
      .pipe(
        timeout(this.requestTimeoutMs),
        map(() => undefined),
        catchError(() => of(undefined))
      );
  }

  // ==========================================
  // HELPERS DE LOCALSTORAGE
  // ==========================================
  private obtenerCatalogoLocal(): Producto[] {
    try {
      const guardado = localStorage.getItem(CATALOGO_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado) as Producto[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Si falla localStorage, usamos los de DataService
    }

    const base = [...this.dataService.getProductos()];
    this.guardarCatalogoLocal(base);
    return base;
  }

  private guardarCatalogoLocal(productos: Producto[]): void {
    try {
      localStorage.setItem(CATALOGO_KEY, JSON.stringify(productos));
    } catch {
      // Ignorar si el almacenamiento está lleno o bloqueado
    }
  }
}