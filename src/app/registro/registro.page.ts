import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton, IonIcon } from '@ionic/angular';

import { DataService } from '../services/data';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonIcon, 
    CommonModule,
    FormsModule,
    IonContent,
    IonInput,
    IonButton
  ]
})
export class RegistroPage {

  nombre = '';
  correo = '';
  password = '';
  confirmarPassword = '';

  mensajeError = '';

  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  registrarse(): void {
    this.mensajeError = '';

    if (
      this.nombre.trim() === '' ||
      this.correo.trim() === '' ||
      this.password.trim() === '' ||
      this.confirmarPassword.trim() === ''
    ) {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    if (this.password.length < 6) {
      this.mensajeError =
        'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const registrado = this.dataService.registrarUsuario(
      this.nombre,
      this.correo,
      this.password
    );

    if (!registrado) {
      this.mensajeError = 'Este correo ya está registrado.';
      return;
    }

    this.router.navigate(['/login']);
  }

  regresarLogin(): void {
    this.router.navigate(['/login']);
  }
}