import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonInput,
  IonButton
} from '@ionic/angular';

import { Usuario } from '../models/producto.models';

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

  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Reyna',
      correo: 'reyna@gmail.com'
    },
    {
      id: 2,
      nombre: 'Cliente',
      correo: 'cliente@gmail.com'
    }
  ];

  correo = '';
  password = '';

  mensajeError = '';
  mostrarPassword = false;

  constructor(private router: Router) {}

  iniciarSesion(): void {

    this.mensajeError = '';

    if (
      this.correo.trim() === '' ||
      this.password.trim() === ''
    ) {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    const usuarioEncontrado = this.usuarios.find(
      usuario =>
        usuario.correo.toLowerCase() ===
        this.correo.trim().toLowerCase()
    );

    if (!usuarioEncontrado) {
      this.mensajeError = 'El correo no está registrado.';
      return;
    }

    if (this.password !== '123456') {
      this.mensajeError = 'La contraseña es incorrecta.';
      return;
    }

    this.router.navigate(['/home']);
  }

  cambiarVisibilidadPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  irARegistro(): void {
    this.router.navigate(['/home']);
  }
}