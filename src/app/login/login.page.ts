import { Component } from '@core/angular';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  // ArrayList de Usuarios
  listaUsuarios: Usuario[] = [
    { id: 1, nombre: 'Luciana Silvaran', correo: 'luciana@correo.com' },
    { id: 2, nombre: 'Cliente Demo', correo: 'cliente@correo.com' }
  ];

  constructor() {}
}
