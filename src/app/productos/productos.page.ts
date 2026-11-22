import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonBackButton
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';
import { FastFoodApiService } from '../services/fast-food-api.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton
  ]
})
export class ProductosPage {
  productos: Producto[] = [];
  categorias: string[] = [];
  sabores: string[] = [];

  nuevoNombre = '';
  nuevoPrecio: number | null = null;
  nuevaCategoria = '';
  nuevoSabor = '';
  nuevaDescripcion = '';
  nuevaImagen = '';
  mensaje = '';
  cargando = false;
  guardando = false;
  productoEditandoId: number | null = null;

  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  private readonly api = inject(FastFoodApiService);
  private readonly cd = inject(ChangeDetectorRef);

  async ionViewWillEnter(): Promise<void> {
    await this.inicializarVista();
  }

  private async inicializarVista(): Promise<void> {
    await this.dataService.obtenerSesionGuardada();

    if (!this.dataService.usuarioEsAdministrador()) {
      this.router.navigateByUrl('/home');
      return;
    }

    this.categorias = this.dataService.getCategorias();
    this.sabores = this.dataService.getSabores();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.api.listar().subscribe({
      next: productos => {
        this.productos = [...productos];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: error => {
        this.mensaje = error.message;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  nombreCategoria(categoria: string): string {
    return categoria;
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    if (!archivo.type.startsWith('image/')) {
      this.mensaje = 'Selecciona un archivo de imagen válido.';
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      this.nuevaImagen = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  }

  agregarProducto(): void {
    if (this.guardando) return;
    this.mensaje = '';

    if (this.nuevoNombre.trim() === '') {
      this.mensaje = 'Escribe el nombre del producto.';
      return;
    }
    if (this.nuevoPrecio === null || this.nuevoPrecio <= 0) {
      this.mensaje = 'Escribe un precio válido.';
      return;
    }
    if (this.nuevaCategoria === '') {
      this.mensaje = 'Selecciona una categoría.';
      return;
    }
    if (this.nuevaDescripcion.trim() === '') {
      this.mensaje = 'Escribe una descripción para el producto.';
      return;
    }
    if (this.nuevaImagen.trim() === '') {
      this.mensaje = 'Escribe la URL de la imagen del producto.';
      return;
    }

    const nuevoProducto: Producto = {
      id: 0,
      nombre: this.nuevoNombre.trim(),
      precio: Number(this.nuevoPrecio),
      categoria: this.nuevaCategoria,
      sabor: this.nuevoSabor,
      descripcion: this.nuevaDescripcion.trim(),
      imagen: this.nuevaImagen
    };

    const request =
      this.productoEditandoId === null
        ? this.api.crear(nuevoProducto)
        : this.api.actualizar(this.productoEditandoId, nuevoProducto);

    this.guardando = true;
    request.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: () => {
        this.mensaje =
          this.productoEditandoId === null
            ? 'Producto agregado correctamente.'
            : 'Producto actualizado correctamente.';
        this.limpiarFormulario();
        this.cargarProductos();
      },
      error: error => (this.mensaje = error.message || 'No se pudo guardar el producto.')
    });
  }

  private limpiarFormulario(): void {
    this.nuevoNombre = '';
    this.nuevoPrecio = null;
    this.nuevaCategoria = '';
    this.nuevoSabor = '';
    this.nuevaDescripcion = '';
    this.nuevaImagen = '';
    this.productoEditandoId = null;
  }

  editarProducto(producto: Producto): void {
    this.productoEditandoId = producto.id;
    this.nuevoNombre = producto.nombre;
    this.nuevoPrecio = producto.precio;
    this.nuevaCategoria = producto.categoria;
    this.nuevoSabor = producto.sabor ?? '';
    this.nuevaDescripcion = producto.descripcion ?? '';
    this.nuevaImagen = producto.imagen ?? '';
    this.mensaje = 'Edita los datos y guarda los cambios.';
  }

  eliminarProducto(indice: number): void {
    const producto = this.productos[indice];
    if (!producto) return;

    this.api.eliminar(producto.id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== producto.id);
        this.mensaje = 'Producto eliminado correctamente.';
        this.cd.detectChanges();
      },
      error: error => (this.mensaje = error.message)
    });
  }

  regresar(): void {
    this.router.navigateByUrl('/home');
  }
}