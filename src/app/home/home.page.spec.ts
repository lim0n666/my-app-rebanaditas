import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  IonLabel
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonLabel
  ]
})
export class HomePage {

  // ==========================================
  // PRODUCTOS
  // ==========================================

  productos: Producto[] = [];

  productosFiltrados: Producto[] = [];

  // ==========================================
  // FILTROS
  // ==========================================

  categorias: string[] = [];

  sabores: string[] = [];

  textoBusqueda = '';

  categoriaSeleccionada = '';

  saborSeleccionado = '';

  precioMaximo = 100;

  mostrarFiltros = false;

  // ==========================================
  // ADMINISTRADOR
  // ==========================================

  esAdmin = false;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  // ==========================================
  // INICIALIZAR
  // ==========================================

  ngOnInit(): void {

    this.cargarProductos();

  }

  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  cargarProductos(): void {

    this.productos =
      this.dataService.getProductos();

    this.productosFiltrados =
      [...this.productos];

    // Categorías utilizadas únicamente
    // dentro del filtro

    this.categorias =
      this.dataService.getCategorias();

    // Obtener sabores automáticamente
    // desde el arreglo de productos

    this.sabores = [
      ...new Set(
        this.productos.map(
          producto => producto.sabor
        )
      )
    ];

    this.esAdmin =
      this.dataService.usuarioEsAdministrador();

  }

  // ==========================================
  // BUSCAR
  // ==========================================

  buscarProducto(event: any): void {

    this.textoBusqueda =
      event.detail.value || '';

    this.aplicarFiltros();

  }

  // ==========================================
  // CAMBIAR CATEGORÍA
  // ==========================================

  cambiarCategoria(event: any): void {

    this.categoriaSeleccionada =
      event.detail.value || '';

    this.aplicarFiltros();

  }

  // ==========================================
  // CAMBIAR SABOR
  // ==========================================

  cambiarSabor(event: any): void {

    this.saborSeleccionado =
      event.detail.value || '';

    this.aplicarFiltros();

  }

  // ==========================================
  // CAMBIAR PRECIO
  // ==========================================

  cambiarPrecio(event: any): void {

    this.precioMaximo =
      Number(event.detail.value);

    this.aplicarFiltros();

  }

  // ==========================================
  // APLICAR TODOS LOS FILTROS
  // ==========================================

  aplicarFiltros(): void {

    let resultado =
      [...this.productos];

    // BUSCAR POR NOMBRE

    if (
      this.textoBusqueda.trim() !== ''
    ) {

      resultado =
        resultado.filter(
          producto =>
            producto.nombre
              .toLowerCase()
              .includes(
                this.textoBusqueda
                  .toLowerCase()
              )
        );

    }

    // FILTRAR POR CATEGORÍA

    if (
      this.categoriaSeleccionada !== ''
    ) {

      resultado =
        resultado.filter(
          producto =>
            producto.categoria ===
            this.categoriaSeleccionada
        );

    }

    // FILTRAR POR SABOR

    if (
      this.saborSeleccionado !== ''
    ) {

      resultado =
        resultado.filter(
          producto =>
            producto.sabor ===
            this.saborSeleccionado
        );

    }

    // FILTRAR POR PRECIO

    resultado =
      resultado.filter(
        producto =>
          producto.precio <=
          this.precioMaximo
      );

    this.productosFiltrados =
      resultado;

  }

  // ==========================================
  // ABRIR FILTROS
  // ==========================================

  abrirFiltros(): void {

    this.mostrarFiltros = true;

  }

  // ==========================================
  // CERRAR FILTROS
  // ==========================================

  cerrarFiltros(): void {

    this.mostrarFiltros = false;

  }

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  limpiarFiltros(): void {

    this.categoriaSeleccionada = '';

    this.saborSeleccionado = '';

    this.precioMaximo = 100;

    this.textoBusqueda = '';

    this.productosFiltrados =
      [...this.productos];

  }

  // ==========================================
  // VER PRODUCTO
  // ==========================================

  verProducto(
    producto: Producto
  ): void {

    this.router.navigate([
      '/detalle-producto',
      producto.id
    ]);

  }

  // ==========================================
  // CARRITO
  // ==========================================

  irAlCarrito(): void {

    this.router.navigate([
      '/carrito'
    ]);

  }

  // ==========================================
  // PERFIL
  // ==========================================

  irAlUsuario(): void {

    this.router.navigate([
      '/perfil'
    ]);

  }

  // ==========================================
  // ADMINISTRAR PRODUCTOS
  // ==========================================

  irAProductos(): void {

    if (!this.esAdmin) {
      return;
    }

    this.router.navigate([
      '/productos'
    ]);

  }

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    this.dataService.cerrarSesion();

    this.router.navigate([
      '/login'
    ]);

  }

}