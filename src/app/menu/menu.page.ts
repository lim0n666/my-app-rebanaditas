import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
export class MenuPage implements OnInit {
  private readonly router = inject(Router);

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

  ngOnInit(): void {
    this.cargarDatosSesion();
  }

  ionViewWillEnter(): void {
    this.cargarDatosSesion();
  }

 private cargarDatosSesion(): void {
    // Busca en cualquier clave guardada en sessionStorage o localStorage
    const storages = [sessionStorage, localStorage];

    for (const storage of storages) {
      for (let i = 0; i < storage.length; i++) {
        const clave = storage.key(i);
        if (!clave) continue;

        const valor = storage.getItem(clave);
        if (!valor || !valor.startsWith('{')) continue;

        try {
          const obj = JSON.parse(valor);
          const correo = (obj?.correo || obj?.email || '').toLowerCase();
          const nombre = obj?.nombre || obj?.name || obj?.username;

          if (correo || nombre) {
            this.nombreUsuario = nombre || 'Administrador';
            this.correoUsuario = correo;
            this.esAdmin =
              obj?.rol === 'admin' ||
              obj?.role === 'admin' ||
              correo === 'admin@rebanaditas.com';
            return;
          }
        } catch {
          // Ignora valores que no sean JSON de usuario
        }
      }
    }
  }

  abrirRedSocial(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    localStorage.removeItem('usuario_activo');
    localStorage.removeItem('usuarioActual');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}