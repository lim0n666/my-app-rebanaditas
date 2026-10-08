import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular';
import { DataService } from '../services/data';
import { Usuario } from '../models/producto.models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton
  ]
})
export class PerfilPage {
  usuario: Usuario | undefined;

  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);

  ionViewWillEnter(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.usuario = this.dataService.getUsuarioActual();
  }

  irALogin(): void {
    this.router.navigateByUrl('/login');
  }

  cerrarSesion(): void {
    this.dataService.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}