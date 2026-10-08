import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DataService } from '../services/data';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
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
    // Navega a la nueva página pasando la categoría en la URL
    this.router.navigate(['/productos-por-categoria', categoria]);
  }
}