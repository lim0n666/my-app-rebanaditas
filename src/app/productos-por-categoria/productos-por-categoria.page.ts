import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonImg,
  IonCardContent,
  IonLoading
} from '@ionic/angular';
import { Producto } from '../models/producto.models';
import { FastFoodApiService } from '../services/fast-food-api.service';

@Component({
  selector: 'app-productos-por-categoria',
  templateUrl: './productos-por-categoria.page.html',
  styleUrls: ['./productos-por-categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonCardContent,
    IonLoading
  ]
})
export class ProductosPorCategoriaPage implements OnInit {
  nombreCategoria = '';
  private categoriaSlug = '';
  productosDeLaCategoria: Producto[] = [];
  mensajeError = '';
  cargando = false;
  cargandoProducto = false;
  mensajeLoading = 'Cargando productos...';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(FastFoodApiService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.inicializarCategoria();
  }

  ionViewWillEnter(): void {
    this.inicializarCategoria();
  }

  private inicializarCategoria(): void {
    const raw = decodeURIComponent(
      this.route.snapshot.paramMap.get('nombre') ||
      this.route.snapshot.paramMap.get('categoria') ||
      ''
    ).trim();

    this.categoriaSlug = raw.toLowerCase();

    const nombres: Record<string, string> = {
      pastel: 'Pasteles',
      pasteles: 'Pasteles',
      carlota: 'Carlotas',
      carlotas: 'Carlotas',
      pay: 'Pays',
      pays: 'Pays',
      helado: 'Helados',
      helados: 'Helados',
      gelatina: 'Gelatinas',
      gelatinas: 'Gelatinas',
      brownie: 'Brownies',
      brownies: 'Brownies',
      bebida: 'Bebidas',
      bebidas: 'Bebidas',
      flan: 'Flanes',
      flanes: 'Flanes',
      dona: 'Donas',
      donas: 'Donas',
      galleta: 'Galletas',
      galletas: 'Galletas'
    };

    this.nombreCategoria =
      nombres[this.categoriaSlug] ??
      (raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Categoría');

    this.cargarProductosDeCategoria();
  }

  cargarProductosDeCategoria(): void {
    this.mensajeLoading = `Cargando ${this.nombreCategoria.toLowerCase()}...`;
    this.cargando = true;
    this.mensajeError = '';

    this.api.listar().subscribe({
      next: todos => {
        const filtro = this.normalizar(this.nombreCategoria);
        const slugFiltro = this.normalizar(this.categoriaSlug);

        this.productosDeLaCategoria = todos.filter(p => {
          const cat = this.normalizar(p.categoria || '');
          return (
            cat === filtro ||
            cat === slugFiltro ||
            cat.includes(slugFiltro) ||
            filtro.includes(cat)
          );
        });

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: error => {
        this.mensajeError = error.message;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/s$/, '')
      .trim();
  }

  verDetalleProducto(producto: Producto): void {
    this.mensajeLoading = 'Cargando producto...';
    this.cargandoProducto = true;

    setTimeout(() => {
      this.cargandoProducto = false;
      this.router.navigate(['/detalle-producto', producto.id]);
    }, 650);
  }
  onLoadingDismiss(): void {
    this.cargando = false;
    this.cargandoProducto = false;
    this.cd.detectChanges();
  }
}