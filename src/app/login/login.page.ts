import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../services/data';

import {
  IonContent,
  IonInput,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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

  // Inyección de dependencias para gestionar la navegación
// y acceder a los servicios de datos de la aplicación.
constructor(
  private router: Router,
  private dataService: DataService
) {}

  iniciarSesion(): void {

    this.mensajeError = '';

    // Validar campos vacíos
    if (
      this.correo.trim() === '' ||
      this.password.trim() === ''
    ) {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    // ==========================================
    // VERIFICAR ADMINISTRADOR
    // ==========================================

    if (
      this.dataService.esAdministrador(
        this.correo.trim(),
        this.password
      )
    ) {

      const administrador =
        this.dataService.getAdministrador();

      this.dataService.setUsuarioActual(administrador);

      // CORREGIDO: Redirige a /home en lugar de /app/home
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
          this.correo.trim().toLowerCase()
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
      usuarioEncontrado.password !==
      this.password
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

    // CORREGIDO: Redirige a /home en lugar de /app/home
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