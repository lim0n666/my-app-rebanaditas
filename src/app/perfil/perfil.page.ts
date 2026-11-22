import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  createOutline,
  personOutline,
  callOutline,
  mailOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  logoWhatsapp,
  timeOutline,
  logOutOutline
} from 'ionicons/icons';
import { DataService } from '../services/data';
import { Usuario } from '../models/producto.models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class PerfilPage {
  usuario: Usuario | undefined;
  editando = false;
  nombreEditable = '';
  telefonoEditable = '';

  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);
  private readonly cd = inject(ChangeDetectorRef);

  constructor() {
    addIcons({
      createOutline,
      personOutline,
      callOutline,
      mailOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      checkmarkCircleOutline,
      logoWhatsapp,
      timeOutline,
      logOutOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarUsuario();
  }

  async cargarUsuario(): Promise<void> {
    this.usuario = await this.dataService.obtenerSesionGuardada();
    if (this.usuario) {
      this.nombreEditable = this.usuario.nombre || '';
      const { value: telGuardado } = await Preferences.get({
        key: `rebanaditas_tel_${this.usuario.correo}`
      });
      this.telefonoEditable = (this.usuario as any).telefono || telGuardado || '';
    }
    this.editando = false;
    this.cd.detectChanges();
  }

  obtenerInicial(): string {
    return (this.usuario?.nombre || 'U').trim().charAt(0).toUpperCase();
  }

  esAdmin(): boolean {
    return (this.usuario?.correo || '').toLowerCase() === 'admin@rebanaditas.com';
  }

  activarEdicion(): void {
    this.editando = true;
  }

  async cancelarEdicion(): Promise<void> {
    if (this.usuario) {
      this.nombreEditable = this.usuario.nombre;
      const { value: telGuardado } = await Preferences.get({
        key: `rebanaditas_tel_${this.usuario.correo}`
      });
      this.telefonoEditable = (this.usuario as any).telefono || telGuardado || '';
    }
    this.editando = false;
  }

  async guardarCambios(): Promise<void> {
    if (!this.usuario) return;

    const nombreLimpio = this.nombreEditable.trim();
    const telLimpio = this.telefonoEditable.trim();

    if (nombreLimpio.length < 3) {
      const toastError = await this.toastCtrl.create({
        message: 'El nombre debe tener al menos 3 caracteres.',
        duration: 2000,
        color: 'danger'
      });
      await toastError.present();
      return;
    }

    this.usuario.nombre = nombreLimpio;
    (this.usuario as any).telefono = telLimpio;

    await Preferences.set({
      key: `rebanaditas_tel_${this.usuario.correo}`,
      value: telLimpio
    });
    await this.dataService.setUsuarioActual(this.usuario);

    this.editando = false;
    this.cd.detectChanges();

    const toast = await this.toastCtrl.create({
      message: 'Perfil actualizado correctamente.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  irALogin(): void {
    this.router.navigateByUrl('/login');
  }

  async cerrarSesion(): Promise<void> {
    await this.dataService.cerrarSesion();
    this.usuario = undefined;
    this.router.navigateByUrl('/login');
  }
}