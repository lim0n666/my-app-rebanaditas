import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonImg,
  IonCardContent,
  IonModal,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonLabel,
  IonMenu
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonCardContent,
    IonModal,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonLabel,
    IonMenu
  ]
})
export class HomePage implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
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
  esAdmin = false;



  constructor() {}

  ngOnInit(): void {
    this.cargarProductos();

    // Escucha cambios en los queryParams de la URL
    this.route.queryParams.subscribe(params => {
      this.categoriaSeleccionada = params && params['categoria'] ? params['categoria'] : '';
      this.aplicarFiltros();
    });
  }

  // Reactiva la carga y filtros cada vez que vuelves a esta pestaña en Ionic
 ionViewWillEnter(): void {
    this.cargarProductos();

    // 1. Revisamos si viene guardada la categoría desde el servicio
    const categoriaServicio = this.dataService.getCategoriaFiltro();
    const categoriaParam = this.route.snapshot.queryParamMap.get('categoria');

    if (categoriaServicio) {
      this.categoriaSeleccionada = categoriaServicio;
      this.dataService.setCategoriaFiltro(''); // Se limpia para que no quede fija
    } else if (categoriaParam) {
      this.categoriaSeleccionada = categoriaParam;
    }

    // 2. Filtramos la lista
    this.aplicarFiltros();

    // 3. Forzamos a Angular a actualizar la pantalla de inmediato
    this.cd.detectChanges();
  }

  cargarProductos(): void {
    this.productos = this.dataService.getProductos();
    this.productosFiltrados = [...this.productos];
    this.categorias = this.dataService.getCategorias();
    this.sabores = this.dataService.getSabores();
    this.esAdmin = this.dataService.usuarioEsAdministrador();
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

    // Búsqueda por texto
    if (this.textoBusqueda.trim() !== '') {
      resultado = resultado.filter(producto =>
        producto.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
    }

    // Filtro por categoría normalizado
    if (this.categoriaSeleccionada && this.categoriaSeleccionada.trim() !== '') {
      resultado = resultado.filter(
        producto =>
          producto.categoria?.trim().toLowerCase() ===
          this.categoriaSeleccionada.trim().toLowerCase()
      );
    }

    // Filtro por sabor normalizado
    if (this.saborSeleccionado && this.saborSeleccionado.trim() !== '') {
      resultado = resultado.filter(
        producto =>
          producto.sabor?.trim().toLowerCase() ===
          this.saborSeleccionado.trim().toLowerCase()
      );
    }

    // Filtro por precio
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

  abrirInstagram(): void {
    window.open('https://www.instagram.com/sweet_rebanaditas/', '_blank');
  }

  irAProductos(): void {
    if (!this.esAdmin) {
      return;
    }
    this.router.navigateByUrl('/productos');
  }

  cerrarSesion(): void {
    this.dataService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}