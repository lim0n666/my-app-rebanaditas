import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star, starOutline, sendOutline, chatbubblesOutline, personCircleOutline } from 'ionicons/icons';
import { DataService } from '../services/data';

export interface ComentarioCliente {
  id: number;
  autor: string;
  calificacion: number;
  mensaje: string;
  fecha: string;
}

const CLAVE_COMENTARIOS = 'rebanaditas_comentarios_v1';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption
  ]
})
export class ComentariosPage {
  private readonly toastCtrl = inject(ToastController);
  private readonly dataService = inject(DataService);

  autor = '';
  calificacion = 5;
  mensaje = '';
  comentarios: ComentarioCliente[] = [];

  constructor() {
    addIcons({
      star,
      starOutline,
      sendOutline,
      chatbubblesOutline,
      personCircleOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.detectarUsuarioActivo();
    await this.cargarComentarios();
  }

  private async detectarUsuarioActivo(): Promise<void> {
    const usuario = await this.dataService.obtenerSesionGuardada();
    if (usuario?.nombre) {
      this.autor = usuario.nombre;
    }
  }

  private async cargarComentarios(): Promise<void> {
    const { value } = await Preferences.get({ key: CLAVE_COMENTARIOS });
    if (value) {
      try {
        this.comentarios = JSON.parse(value);
        return;
      } catch {
        // Si falla el parseo, usa los de ejemplo
      }
    }

    this.comentarios = [
      {
        id: 1,
        autor: 'Reyna M.',
        calificacion: 5,
        mensaje: 'El pay de limón y el chocoflan están deliciosos, súper frescos y con excelente presentación.',
        fecha: '16 nov 2026'
      },
      {
        id: 2,
        autor: 'Carlos H.',
        calificacion: 5,
        mensaje: 'Muy fácil hacer el pedido desde la app y el cheesecake de fresa llegó perfecto.',
        fecha: '17 nov 2026'
      }
    ];
    await this.guardarComentarios();
  }

  private async guardarComentarios(): Promise<void> {
    await Preferences.set({
      key: CLAVE_COMENTARIOS,
      value: JSON.stringify(this.comentarios)
    });
  }

  async enviarComentario(): Promise<void> {
    const nombreLimpio = this.autor.trim();
    const mensajeLimpio = this.mensaje.trim();

    if (!nombreLimpio || !mensajeLimpio) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor escribe tu nombre y tu comentario.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const nuevo: ComentarioCliente = {
      id: Date.now(),
      autor: nombreLimpio.slice(0, 60),
      calificacion: Number(this.calificacion) || 5,
      mensaje: mensajeLimpio.slice(0, 300),
      fecha: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    this.comentarios = [nuevo, ...this.comentarios];
    await this.guardarComentarios();
    this.mensaje = '';

    const toast = await this.toastCtrl.create({
      message: '¡Gracias por compartir tu reseña con Rebanaditas!',
      duration: 2200,
      color: 'success'
    });
    await toast.present();
  }
}