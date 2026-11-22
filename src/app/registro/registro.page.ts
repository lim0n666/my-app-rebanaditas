import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
  private readonly authService = inject(AuthService);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly toastCtrl = inject(ToastController);

  async registrarse(): Promise<void> {
    this.mensajeError = '';

    const valNombre = this.authService.validarNombre(this.nombre);
    if (!valNombre.valido) {
      this.mensajeError = valNombre.mensaje;
      return;
    }

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

    if (this.password.trim() !== this.confirmarPassword.trim()) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Generando cuenta y token...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const resultado = await this.authService.registrarConApi(
        this.nombre,
        this.correo,
        this.password
      );
      await loading.dismiss();

      if (!resultado.exito) {
        this.mensajeError = resultado.mensaje;
        return;
      }

      const toast = await this.toastCtrl.create({
        message: resultado.mensaje,
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      // Entra directo al Home sin tener que volver a hacer login
      this.router.navigate(['/home']);
    } catch {
      await loading.dismiss();
      this.mensajeError = 'No se pudo completar el registro.';
    }
  }

  regresarLogin(): void {
    this.router.navigate(['/login']);
  }
}