import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DataService } from './data';

export interface FakeStoreUser {
  id: number;
  email: string;
  username: string;
  password: string;
  name?: {
    firstname: string;
    lastname: string;
  };
}

export interface ResultadoValidacion {
  valido: boolean;
  mensaje: string;
}

const CLAVE_HASHES = 'rebanaditas_usuarios_hash_v1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(DataService);
  private readonly apiUsersUrl = 'https://fakestoreapi.com/users';
  private readonly apiCartsUrl = 'https://fakestoreapi.com/carts';

  private hashesUsuarios: Record<string, string> = {};
  private apiSincronizada = false;

  constructor() {
    this.cargarHashesLocales();
  }

  // =========================================================
  // 1. ENCRIPTACIÓN SHA-256 REAL (Web Crypto API)
  // =========================================================
  async encriptarPassword(textoPlano: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(textoPlano.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private cargarHashesLocales(): void {
    try {
      const guardado = localStorage.getItem(CLAVE_HASHES);
      if (guardado) {
        this.hashesUsuarios = JSON.parse(guardado);
      }
    } catch {
      this.hashesUsuarios = {};
    }
  }

  private guardarHashesLocales(): void {
    localStorage.setItem(CLAVE_HASHES, JSON.stringify(this.hashesUsuarios));
  }

  // =========================================================
  // 2. VALIDACIONES ESTRICTAS EN TYPESCRIPT
  // =========================================================
  validarCorreoProfesional(correo: string): ResultadoValidacion {
    const limpio = correo.trim();

    if (!limpio) {
      return { valido: false, mensaje: 'El correo electrónico es obligatorio.' };
    }
    if (limpio.length > 100) {
      return { valido: false, mensaje: 'El correo no puede superar los 100 caracteres.' };
    }

    // Formato RFC estricto con dominio y extensión válida (mínimo 2 letras)
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(limpio)) {
      return { valido: false, mensaje: 'Ingresa un correo electrónico con formato válido (ej. usuario@dominio.com).' };
    }

    // Bloqueo de dominios temporales/desechables
    const dominiosBloqueados = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com'];
    const dominio = limpio.split('@')[1]?.toLowerCase() ?? '';
    if (dominiosBloqueados.includes(dominio)) {
      return { valido: false, mensaje: 'Por seguridad, usa un correo personal o institucional válido.' };
    }

    return { valido: true, mensaje: '' };
  }

  validarPassword(password: string): ResultadoValidacion {
    const limpio = password.trim();

    if (!limpio) {
      return { valido: false, mensaje: 'La contraseña es obligatoria.' };
    }
    if (limpio.length < 6) {
      return { valido: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    if (limpio.length > 50) {
      return { valido: false, mensaje: 'La contraseña no puede exceder los 50 caracteres.' };
    }

    return { valido: true, mensaje: '' };
  }

  validarNombre(nombre: string): ResultadoValidacion {
    const limpio = nombre.trim();

    if (!limpio) {
      return { valido: false, mensaje: 'El nombre completo es obligatorio.' };
    }
    if (limpio.length < 3 || limpio.length > 80) {
      return { valido: false, mensaje: 'El nombre debe tener entre 3 y 80 caracteres.' };
    }

    return { valido: true, mensaje: '' };
  }

  // =========================================================
  // 3. SINCRONIZACIÓN CON FAKESTORE API (GET /users)
  // =========================================================
  async sincronizarUsuariosApi(): Promise<void> {
    if (this.apiSincronizada) return;

    try {
      const usuariosApi = await firstValueFrom(
        this.http.get<FakeStoreUser[]>(this.apiUsersUrl)
      );

      for (const u of usuariosApi) {
        const correo = u.email.trim().toLowerCase();
        const nombreCompleto = u.name
          ? `${u.name.firstname} ${u.name.lastname}`
          : u.username;

        // Encriptar contraseña proveniente de FakeStoreAPI
        const hash = await this.encriptarPassword(u.password);
        this.hashesUsuarios[correo] = hash;

        // Registrar en DataService si aún no existe
        const existe = this.dataService
          .getUsuarios()
          .some(local => local.correo.trim().toLowerCase() === correo);

        if (!existe) {
          this.dataService.registrarUsuario(nombreCompleto, correo, hash);
        }
      }

      this.guardarHashesLocales();
      this.apiSincronizada = true;
    } catch {
      // Si no hay conexión, opera con usuarios locales sin bloquear la app
    }
  }

  // =========================================================
  // 4. LOGIN Y REGISTRO CON HASH + API REST
  // =========================================================
  async autenticar(correo: string, password: string): Promise<{ exito: boolean; mensaje: string }> {
    await this.sincronizarUsuariosApi();

    const correoLimpio = correo.trim().toLowerCase();
    const passwordHash = await this.encriptarPassword(password);

    // Verificar Administrador
    if (this.dataService.esAdministrador(correoLimpio, password.trim())) {
      const admin = this.dataService.getAdministrador();
      this.hashesUsuarios[correoLimpio] = passwordHash;
      this.guardarHashesLocales();
      this.dataService.setUsuarioActual(admin);
      return { exito: true, mensaje: 'Bienvenido, Administrador.' };
    }

    // Buscar cliente en DataService
    const usuario = this.dataService
      .getUsuarios()
      .find(u => u.correo.trim().toLowerCase() === correoLimpio);

    if (!usuario) {
      return { exito: false, mensaje: 'El correo no está registrado.' };
    }

    // Validar contra hash SHA-256 guardado o contraseña inicial hasheada
    const hashAlmacenado =
      this.hashesUsuarios[correoLimpio] ||
      (usuario.password.length === 64
        ? usuario.password
        : await this.encriptarPassword(usuario.password));

    if (hashAlmacenado !== passwordHash) {
      return { exito: false, mensaje: 'La contraseña ingresada es incorrecta.' };
    }

    this.hashesUsuarios[correoLimpio] = passwordHash;
    this.guardarHashesLocales();
    this.dataService.setUsuarioActual(usuario);

    return { exito: true, mensaje: `¡Bienvenido, ${usuario.nombre}!` };
  }

  async registrarConApi(
    nombre: string,
    correo: string,
    password: string
  ): Promise<{ exito: boolean; mensaje: string }> {
    await this.sincronizarUsuariosApi();

    const correoLimpio = correo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();
    const passwordHash = await this.encriptarPassword(password);

    // Guardar localmente con la contraseña ya encriptada (SHA-256)
    const creado = this.dataService.registrarUsuario(
      nombreLimpio,
      correoLimpio,
      passwordHash
    );

    if (!creado) {
      return { exito: false, mensaje: 'Este correo ya se encuentra registrado.' };
    }

    this.hashesUsuarios[correoLimpio] = passwordHash;
    this.guardarHashesLocales();

    // Enviar POST real a FakeStoreAPI (/users) con contraseña encriptada
    try {
      await firstValueFrom(
        this.http.post(this.apiUsersUrl, {
          email: correoLimpio,
          username: nombreLimpio.toLowerCase().replace(/\s+/g, '_'),
          password: passwordHash
        })
      );
    } catch {
      // Continúa aunque la API pública tarde
    }

    return { exito: true, mensaje: 'Cuenta creada y sincronizada correctamente.' };
  }

  // =========================================================
  // 5. ENVIAR CARRITO A FAKESTORE API (POST /carts)
  // =========================================================
  async sincronizarCarritoApi(
    userId: number,
    productos: Array<{ productId: number; quantity: number }>
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(this.apiCartsUrl, {
          userId: userId || 1,
          date: new Date().toISOString().split('T')[0],
          products: productos
        })
      );
    } catch {
      // Respaldo offline silencioso
    }
  }
}