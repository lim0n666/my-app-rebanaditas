import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonImg, 
  IonCardContent 
} from '@ionic/angular';
import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';

@Component({
  selector: 'app-productos-por-categoria',
  templateUrl: './productos-por-categoria.page.html',
  styleUrls: ['./productos-por-categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonCardContent
  ]
})
export class ProductosPorCategoriaPage implements OnInit {

  nombreCategoria: string = '';
  productosDeLaCategoria: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Captura el parámetro enviado desde la página de categorías
    this.nombreCategoria = this.route.snapshot.paramMap.get('nombre') || '';
    this.cargarProductosDeCategoria();
  }

  cargarProductosDeCategoria(): void {
    const todosLosProductos = this.dataService.getProductos();
    
    // Filtra todos los productos que coincidan con la categoría
    this.productosDeLaCategoria = todosLosProductos.filter(
      p => p.categoria.trim().toLowerCase() === this.nombreCategoria.trim().toLowerCase()
    );
  }

  verDetalleProducto(producto: Producto): void {
    this.router.navigate(['/detalle-producto', producto.id]);
  }
}