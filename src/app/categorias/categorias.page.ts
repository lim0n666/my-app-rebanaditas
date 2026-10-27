import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data';

import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardTitle 
} from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardTitle
  ]
})
export class CategoriasPage implements OnInit {
  
  categorias: string[] = [];
  private dataService = inject(DataService);
  private router = inject(Router);

  ngOnInit(): void {
    this.categorias = this.dataService.getCategorias();
  }

  seleccionarCategoria(categoria: string): void {
    // Aquí va tu lógica para navegar a los productos de esa categoría
    console.log('Categoría seleccionada:', categoria);
  }
}