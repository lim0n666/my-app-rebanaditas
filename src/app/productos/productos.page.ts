import { Component } from '@angular/core';
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
  IonSelectOption
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

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
    IonSelectOption
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

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Verificar administrador
    if (!this.dataService.usuarioEsAdministrador()) {

      this.router.navigateByUrl('/app/home');

      return;
    }

    this.productos =
      this.dataService.getProductos();

    this.categorias =
      this.dataService.getCategorias();

    this.sabores =
      this.dataService.getSabores();
  }

  seleccionarImagen(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const archivo =
      input.files[0];

    if (
      !archivo.type.startsWith('image/')
    ) {

      this.mensaje =
        'Selecciona un archivo de imagen válido.';

      return;
    }

    const lector =
      new FileReader();

    lector.onload = () => {

      this.nuevaImagen =
        lector.result as string;
    };

    lector.readAsDataURL(archivo);
  }

  agregarProducto(): void {

    this.mensaje = '';

    // Validar nombre
    if (
      this.nuevoNombre.trim() === ''
    ) {

      this.mensaje =
        'Escribe el nombre del producto.';

      return;
    }

    // Validar precio
    if (
      this.nuevoPrecio === null ||
      this.nuevoPrecio <= 0
    ) {

      this.mensaje =
        'Escribe un precio válido.';

      return;
    }

    // Validar categoría
    if (
      this.nuevaCategoria === ''
    ) {

      this.mensaje =
        'Selecciona una categoría.';

      return;
    }

    // Validar sabor
    if (
      this.nuevoSabor === ''
    ) {

      this.mensaje =
        'Selecciona un sabor.';

      return;
    }

    // Validar descripción
    if (
      this.nuevaDescripcion.trim() === ''
    ) {

      this.mensaje =
        'Escribe una descripción.';

      return;
    }

    // Validar imagen
    if (
      this.nuevaImagen === ''
    ) {

      this.mensaje =
        'Selecciona una imagen del producto.';

      return;
    }

    const nuevoProducto: Producto = {

      id:
        this.dataService.obtenerNuevoIdProducto(),

      nombre:
        this.nuevoNombre.trim(),

      precio:
        Number(this.nuevoPrecio),

      categoria:
        this.nuevaCategoria,

      sabor:
        this.nuevoSabor,

      descripcion:
        this.nuevaDescripcion.trim(),

      imagen:
        this.nuevaImagen
    };

    // Guardar producto
    this.dataService.agregarProducto(
      nuevoProducto
    );

    // Actualizar lista
    this.productos =
      this.dataService.getProductos();

    // Limpiar formulario
    this.nuevoNombre = '';
    this.nuevoPrecio = null;
    this.nuevaCategoria = '';
    this.nuevoSabor = '';
    this.nuevaDescripcion = '';
    this.nuevaImagen = '';

    this.mensaje =
      'Producto agregado correctamente.';
  }

  eliminarProducto(indice: number): void {

    const producto =
      this.productos[indice];

    if (!producto) {
      return;
    }

    this.dataService.eliminarProducto(
      producto.id
    );

    this.productos =
      this.dataService.getProductos();

    this.mensaje =
      'Producto eliminado correctamente.';
  }

  regresar(): void {

    this.router.navigateByUrl('/app/home');
  }

}