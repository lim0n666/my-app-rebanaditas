import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonMenuToggle,
  IonItem,
  IonItemDivider,
  IonIcon,
  IonLabel,
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
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonItemDivider,
    IonIcon,
    IonLabel,
  ],
})
export class AppComponent {
  private router = inject(Router);

  constructor() {
    // Registramos todos los íconos que usamos en app.component.html
    addIcons({
      iceCreamOutline,
      timeOutline,
      pricetagsOutline,
      logoInstagram,
      logoFacebook,
      logoTwitter,
      logoYoutube,
      chatbubblesOutline,
      logOutOutline,
    });
  }

  abrirRedSocial(url: string) {
    window.open(url, '_blank');
  }

  cerrarSesion() {
    // Si guardas los datos del usuario o token en localStorage, los limpiamos aquí
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    
    // Redirigimos al login
    this.router.navigate(['/login']);
  }
}