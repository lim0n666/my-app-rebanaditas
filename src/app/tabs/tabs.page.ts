import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  gridOutline,
  cartOutline,
  receiptOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon]
})
export class TabsPage {
  constructor() {
    addIcons({
      homeOutline,
      gridOutline,
      cartOutline,
      receiptOutline,
      personOutline
    });
  }
}