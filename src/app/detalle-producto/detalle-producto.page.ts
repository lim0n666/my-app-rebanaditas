/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  ToastController
} from '@ionic/angular';

import { Producto } from '../models/producto.models';
import { DataService } from '../services/data';
import { FastFoodApiService } from '../services/fast-food-api.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class DetalleProductoPage implements OnInit {
  producto: Producto | undefined;
  cantidad = 1;
  cargando = true;
  mensajeError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private api: FastFoodApiService,
    private toastController: ToastController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDetalle();
  }

  ionViewWillEnter(): void {
    this.cargarDetalle();
  }

  private cargarDetalle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargando = true;

    this.api.obtener(id).subscribe({
      next: producto => {
        this.producto = producto;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: error => {
        this.producto = undefined;
        this.mensajeError = error.message;
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  volverHome(): void {
    this.router.navigateByUrl('/home');
  }

  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  async agregarAlCarrito(): Promise<void> {
    if (!this.producto) {
      return;
    }

    this.dataService.agregarAlCarrito(this.producto, this.cantidad);

    const toast = await this.toastController.create({
      message: `¡Se agregaron ${this.cantidad} producto(s) al carrito!`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });

    await toast.present();
    void this.router.navigateByUrl('/carrito');
  }
}