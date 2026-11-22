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
import { DataService } from './services/data';

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
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

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
      logOutOutline,
    });
  }

  abrirRedSocial(url: string): void {
    window.open(url, '_blank');
  }

  async cerrarSesion(): Promise<void> {
    await this.dataService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}