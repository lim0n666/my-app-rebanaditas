import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FAST_FOOD_DESSERT_CATEGORIES } from '../models/fast-food.models';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  sparklesOutline,
  layersOutline,
  pizzaOutline,
  iceCreamOutline,
  cubeOutline,
  gridOutline,
  cafeOutline,
  restaurantOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon
  ]
})
export class CategoriasPage {
  categorias: string[] = [...FAST_FOOD_DESSERT_CATEGORIES];
  private readonly router = inject(Router);

  constructor() {
    addIcons({
      sparklesOutline,
      layersOutline,
      pizzaOutline,
      iceCreamOutline,
      cubeOutline,
      gridOutline,
      cafeOutline,
      restaurantOutline
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

  obtenerIconoCategoria(categoria: string): string {
    const clave = categoria.trim().toLowerCase();
    const mapaIconos: Record<string, string> = {
      pasteles: 'sparkles-outline',
      carlotas: 'layers-outline',
      pays: 'pizza-outline',
      helados: 'ice-cream-outline',
      gelatinas: 'cube-outline',
      brownies: 'grid-outline',
      bebidas: 'cafe-outline'
    };
    return mapaIconos[clave] ?? 'restaurant-outline';
  }

  seleccionarCategoria(categoria: string): void {
    this.router.navigate(['/productos-por-categoria', categoria]);
  }
}
