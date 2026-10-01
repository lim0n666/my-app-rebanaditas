import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProductosPage implements OnInit {

  listaPostres = [
    { id: 1, nombre: 'Pay de Limón', precio: 35, categoria: 'Pay' },
    { id: 2, nombre: 'Tres Leches', precio: 40, categoria: 'Pasteles' },
    { id: 3, nombre: 'Cheesecake de Fresa', precio: 50, categoria: 'Especiales' },
    { id: 4, nombre: 'Brownie con Nuez', precio: 30, categoria: 'Chocolate' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
