/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonList, 
  IonItem, 
  IonLabel 
} from '@ionic/angular';
import { DataService } from '../services/data';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonList, 
    IonItem, 
    IonLabel
  ]
})
export class CategoriasPage implements OnInit {
  categorias: string[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorias = this.dataService.getCategorias();
  }

seleccionarCategoria(categoria: string): void {
  this.dataService.setCategoriaFiltro(categoria);
  this.router.navigate(['/home'], {
    queryParams: { categoria: categoria }
  });
}
}