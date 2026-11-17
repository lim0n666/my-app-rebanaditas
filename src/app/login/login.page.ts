import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../services/data';

import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonText,
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton
  ]
})
export class LoginPage {
  correo = '';
  password = '';

  mensajeError = '';
  mostrarPassword = false;

  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  constructor() {
    addIcons({ personOutline });
  }
  
  iniciarSesion(): void {

    this.mensajeError = '';

    const correo = this.correo.trim();
    const password = this.password.trim();

    // Validar campos vacíos
    if (correo === '' || password === '') {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    // ==========================================
    // VERIFICAR ADMINISTRADOR
    // ==========================================

    if (
      this.dataService.esAdministrador(
        correo,
        password
      )
    ) {
      const administrador =
        this.dataService.getAdministrador();

      this.dataService.setUsuarioActual(administrador);
      this.router.navigate(['/home']);

      return;
    }

    // ==========================================
    // BUSCAR CLIENTE
    // ==========================================

    const usuarioEncontrado =
      this.dataService.getUsuarios().find(
        usuario =>
          usuario.correo.trim().toLowerCase() ===
          correo.toLowerCase()
      );

    if (!usuarioEncontrado) {
      this.mensajeError =
        'El correo no está registrado.';

      return;
    }

    // ==========================================
    // VERIFICAR CONTRASEÑA
    // ==========================================

    if (
      usuarioEncontrado.password !== password
    ) {
      this.mensajeError =
        'La contraseña es incorrecta.';

      return;
    }

    // ==========================================
    // GUARDAR CLIENTE ACTUAL
    // ==========================================

    this.dataService.setUsuarioActual(
      usuarioEncontrado
    );

    // ==========================================
    // IR AL HOME
    // ==========================================

    this.router.navigate(['/home']);
  }

  cambiarVisibilidadPassword(): void {

    this.mostrarPassword =
      !this.mostrarPassword;

  }

  irARegistro(): void {

    this.router.navigate(['/registro']);

  }
}
