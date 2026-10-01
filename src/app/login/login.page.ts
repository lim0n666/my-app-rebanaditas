import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonButton, IonInput 
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
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonButton, 
    IonInput
  ]
})
export class LoginPage {
  // Arreglo inicial de usuarios (simulando tu estructura)
  listaUsuarios = [
    { id: 1, nombre: 'Luciana Silvaran', correo: 'luciana@correo.com' },
    { id: 2, nombre: 'Cliente Demo', correo: 'cliente@correo.com' }
  ];

  // Variables para el formulario de nuevo usuario / registro
  nuevoNombre: string = '';
  nuevoCorreo: string = '';

  constructor() {}

  // Método para agregar un usuario
  agregarUsuario() {
    if (this.nuevoNombre && this.nuevoCorreo) {
      const nuevo = {
        id: this.listaUsuarios.length + 1,
        nombre: this.nuevoNombre,
        correo: this.nuevoCorreo
      };
      
      this.listaUsuarios.push(nuevo);
      
      // Limpiar campos
      this.nuevoNombre = '';
      this.nuevoCorreo = '';
    }
  }

  // Método para eliminar un usuario por índice
  eliminarUsuario(index: number) {
    this.listaUsuarios.splice(index, 1);
  }
}