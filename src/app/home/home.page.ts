import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    // Escuchamos cada vez que la navegación finaliza para actualizar el filtro entre pestañas
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.verificarCategoriaQuery();
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.verificarCategoriaQuery();
  }

  verificarCategoriaQuery(): void {
    const categoriaParam = this.route.snapshot.queryParamMap.get('categoria');
    
    if (categoriaParam) {
      this.categoriaSeleccionada = categoriaParam;
    } else {
      this.categoriaSeleccionada = '';
    }
    this.aplicarFiltros();
  }

  cargarProductos(): void {

    this.productos =
      this.dataService.getProductos();

    this.productosFiltrados =
      [...this.productos];

    this.categorias =
      this.dataService.getCategorias();

    this.sabores =
      this.dataService.getSabores();

    this.esAdmin =
      this.dataService.usuarioEsAdministrador();
  }

  buscarProducto(event: any): void {

    this.textoBusqueda =
      event.detail.value || '';

    this.aplicarFiltros();
  }

  cambiarCategoria(event: any): void {

    this.categoriaSeleccionada =
      event.detail.value || '';

    this.aplicarFiltros();
  }

  cambiarSabor(event: any): void {

    this.saborSeleccionado =
      event.detail.value || '';

    this.aplicarFiltros();
  }

  cambiarPrecio(event: any): void {

    this.precioMaximo =
      Number(event.detail.value);

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {

    let resultado =
      [...this.productos];

    // BÚSQUEDA
    if (
      this.textoBusqueda.trim() !== ''
    ) {

      resultado =
        resultado.filter(
          producto =>
            producto.nombre
              .toLowerCase()
              .includes(
                this.textoBusqueda.toLowerCase()
              )
        );
    }

    // CATEGORÍA
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

    // SABOR
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

    // PRECIO
    resultado =
      resultado.filter(
        producto =>
          producto.precio <=
          this.precioMaximo
      );

    this.productosFiltrados =
      resultado;
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

    this.productosFiltrados =
      [...this.productos];
  }

  verProducto(producto: Producto): void {

    this.router.navigate([
      '/detalle-producto',
      producto.id
    ]);
  }

  abrirInstagram(): void {

    window.open(
      'https://www.instagram.com/sweet_rebanaditas/',
      '_blank'
    );
  }

  // ==========================================
  // GESTIONAR PRODUCTOS
  // ==========================================

  irAProductos(): void {

    if (!this.esAdmin) {
      return;
    }

    this.router.navigateByUrl('/productos');
  }

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  cerrarSesion(): void {

    this.dataService.cerrarSesion();

    this.router.navigateByUrl('/login');
  }

}