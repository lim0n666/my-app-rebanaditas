import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DataService } from '../services/data';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html', // Corregido: apunta a su propio html
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class CategoriasPage implements OnInit { // Asegura el nombre correcto

  categorias: string[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categorias = this.dataService.getCategorias();
  }

  seleccionarCategoria(categoria: string): void {
    this.router.navigate(['/home'], { queryParams: { categoria } });
  }

}