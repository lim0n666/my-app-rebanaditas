import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  LoadingController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

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
  private readonly authService = inject(AuthService);
  private readonly loadingCtrl = inject(LoadingController);

  constructor() {
    addIcons({ personOutline });
  }

  async iniciarSesion(): Promise<void> {
    this.mensajeError = '';

    // 1. Validaciones estrictas en TypeScript
    const valCorreo = this.authService.validarCorreoProfesional(this.correo);
    if (!valCorreo.valido) {
      this.mensajeError = valCorreo.mensaje;
      return;
    }

    const valPass = this.authService.validarPassword(this.password);
    if (!valPass.valido) {
      this.mensajeError = valPass.mensaje;
      return;
    }

    // 2. Animación de carga (LoadingController)
    const loading = await this.loadingCtrl.create({
      message: 'Validando credenciales...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const resultado = await this.authService.autenticar(this.correo, this.password);
      await loading.dismiss();

      if (!resultado.exito) {
        this.mensajeError = resultado.mensaje;
        return;
      }

      this.router.navigate(['/home']);
    } catch {
      await loading.dismiss();
      this.mensajeError = 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
    }
  }

  cambiarVisibilidadPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}