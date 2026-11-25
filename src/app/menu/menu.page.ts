import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  iceCreamOutline,
  timeOutline,
  pricetagsOutline,
  logoInstagram,
  logoFacebook,
  logoTwitter,
  logoYoutube,
  chatbubblesOutline,
  personCircleOutline,
  logOutOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { DataService } from '../services/data';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardContent,
    IonButton
  ]
})
export class MenuPage {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly cd = inject(ChangeDetectorRef);

  nombreUsuario = 'Invitado';
  correoUsuario = '';
  esAdmin = false;

  constructor() {
    addIcons({
      iceCreamOutline,
      timeOutline,
      pricetagsOutline,
      logoInstagram,
      logoFacebook,
      logoTwitter,
      logoYoutube,
      chatbubblesOutline,
      personCircleOutline,
      logOutOutline,
      chevronForwardOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarDatosSesion();
  }

  private async cargarDatosSesion(): Promise<void> {
    const usuario = await this.dataService.obtenerSesionGuardada();
    if (usuario) {
      this.nombreUsuario = usuario.nombre || 'Administrador';
      this.correoUsuario = usuario.correo || '';
      this.esAdmin =
        this.dataService.usuarioEsAdministrador() ||
        this.correoUsuario.toLowerCase() === 'admin@rebanaditas.com';
    } else {
      this.nombreUsuario = 'Invitado';
      this.correoUsuario = '';
      this.esAdmin = false;
    }
    //cambios
    this.cd.detectChanges();
  }

  abrirRedSocial(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
    
  }

  async cerrarSesion(): Promise<void> {
    await this.dataService.cerrarSesion();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}