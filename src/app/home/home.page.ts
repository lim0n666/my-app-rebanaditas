import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  iceCreamOutline,
  personCircleOutline
} from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonModal,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonLabel,
  IonIcon
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';
import { FastFoodApiService } from '../services/fast-food-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonIcon,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonButton,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonModal,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonLabel
  ]
})
export class HomePage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  private readonly api = inject(FastFoodApiService);
  private readonly cd = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  categorias: string[] = [];
  sabores: string[] = [];

  textoBusqueda = '';
  categoriaSeleccionada = '';
  saborSeleccionado = '';

  precioMaximo = 500;

  mostrarFiltros = false;
  cargando = false;
  mensajeError = '';

  constructor() {
    addIcons({
      iceCreamOutline,
      personCircleOutline
    });
  }

  imagenRespaldo(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img || img.dataset['fallback']) return;
    img.dataset['fallback'] = 'true';
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffd6e7"/>
              <stop offset="100%" stop-color="#ff9ec7"/>
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#g)"/>
          <circle cx="200" cy="125" r="52" fill="#fff5f9"/>
          <text x="200" y="138" font-size="46" text-anchor="middle">🍰</text>
          <text x="200" y="215" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#7a1c4b" text-anchor="middle">Rebanaditas</text>
          <text x="200" y="242" font-family="Arial, sans-serif" font-size="14" fill="#9c2c63" text-anchor="middle">Postres que enamoran</text>
        </svg>`
      );
  }

  ionViewWillEnter(): void {
    this.cargarProductos();

    const categoriaServicio = this.dataService.getCategoriaFiltro();
    const categoriaParam = this.route.snapshot.queryParamMap.get('categoria');

    if (categoriaServicio) {
      this.categoriaSeleccionada = categoriaServicio;
      this.dataService.setCategoriaFiltro('');
    } else if (categoriaParam) {
      this.categoriaSeleccionada = categoriaParam;
    }

    this.aplicarFiltros();
    this.cd.detectChanges();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    const productosLocales = this.dataService.getProductos();

    this.api.listar().subscribe({
      next: productos => {
        this.productos = productos.map(p => {
          const local = productosLocales.find(
            item => item.id === p.id || item.nombre.toLowerCase() === p.nombre.toLowerCase()
          );
          return {
            ...p,
            imagen: local ? local.imagen : p.imagen
          };
        });

        const catsProductos = this.productos.map(p => p.categoria).filter(Boolean);
        const catsBase = this.dataService.getCategorias();
        this.categorias = [...new Set([...catsBase, ...catsProductos])].sort();
        this.sabores = [...new Set(this.productos.map(p => p.sabor).filter(Boolean))].sort();
        this.aplicarFiltros();
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.productos = productosLocales;
        this.categorias = this.dataService.getCategorias();
        this.sabores = [...new Set(this.productos.map(p => p.sabor).filter(Boolean))].sort();
        this.aplicarFiltros();
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  nombreCategoria(categoria: string): string {
    const nombres: Record<string, string> = {
      pastel: 'Pasteles',
      dona: 'Donas',
      galletas: 'Galletas'
    };
    return nombres[categoria] ?? categoria;
  }

  buscarProducto(event: any): void {
    this.textoBusqueda = event.detail.value || '';
    this.aplicarFiltros();
  }

  cambiarCategoria(event: any): void {
    this.categoriaSeleccionada = event.detail.value || '';
    this.aplicarFiltros();
  }

  cambiarSabor(event: any): void {
    this.saborSeleccionado = event.detail.value || '';
    this.aplicarFiltros();
  }

  cambiarPrecio(event: any): void {
    this.precioMaximo = Number(event.detail.value);
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.productos];

    if (this.textoBusqueda.trim() !== '') {
      resultado = resultado.filter(producto =>
        producto.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
    }

    if (this.categoriaSeleccionada && this.categoriaSeleccionada.trim() !== '') {
      resultado = resultado.filter(
        producto =>
          producto.categoria?.trim().toLowerCase() ===
          this.categoriaSeleccionada.trim().toLowerCase()
      );
    }

    if (this.saborSeleccionado && this.saborSeleccionado.trim() !== '') {
      resultado = resultado.filter(
        producto =>
          producto.sabor?.trim().toLowerCase() ===
          this.saborSeleccionado.trim().toLowerCase()
      );
    }

    resultado = resultado.filter(producto => producto.precio <= this.precioMaximo);
    this.productosFiltrados = resultado;
  }

  abrirFiltros(): void {
    this.mostrarFiltros = true;
  }

  cerrarFiltros(): void {
    this.mostrarFiltros = false;
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.saborSeleccionado = '';
    this.precioMaximo = 500;
    this.textoBusqueda = '';
    this.productosFiltrados = [...this.productos];
  }

  verProducto(producto: Producto): void {
    this.router.navigate(['/detalle-producto', producto.id]);
  }
}