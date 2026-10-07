import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
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
    IonContent,
    IonButton
  ]
})
export class PerfilPage {

  usuario: Usuario | undefined;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.usuario = this.dataService.getUsuarioActual();
  }

  regresar(): void {
    this.router.navigate(['/home']);
  }

  cerrarSesion(): void {
    this.dataService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}