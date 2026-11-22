import { Injectable, inject } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
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
const CLAVE_TOKEN = 'rebanaditas.authToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly dataService = inject(DataService);
  private readonly apiUsersUrl = 'https://fakestoreapi.com/users';
  private readonly apiCartsUrl = 'https://fakestoreapi.com/carts';

  private hashesUsuarios: Record<string, string> = {};
  private apiSincronizada = false;

  // =========================================================
  // 1. ENCRIPTACIÓN Y GENERACIÓN DE TOKEN HASH SHA-256
  // =========================================================
  async generarHashSha256(textoPlano: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(textoPlano.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async generarTokenSesion(correo: string): Promise<string> {
    const semilla = `${correo.trim().toLowerCase()}|REBANADITAS_SECRET|${Date.now()}`;
    return this.generarHashSha256(semilla);
  }

  async obtenerTokenActual(): Promise<string | null> {
    const { value } = await Preferences.get({ key: CLAVE_TOKEN });
    return value;
  }

  private async cargarHashesLocales(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: CLAVE_HASHES });
      if (value) {
        this.hashesUsuarios = JSON.parse(value);
      }
    } catch {
      this.hashesUsuarios = {};
    }
  }

  private async guardarHashesLocales(): Promise<void> {
    await Preferences.set({
      key: CLAVE_HASHES,
      value: JSON.stringify(this.hashesUsuarios)
    });
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
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(limpio)) {
      return { valido: false, mensaje: 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).' };
    }
    const dominiosBloqueados = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com'];
    const dominio = limpio.split('@')[1]?.toLowerCase() ?? '';
    if (dominiosBloqueados.includes(dominio)) {
      return { valido: false, mensaje: 'Usa un correo personal o institucional válido.' };
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
  // 3. SINCRONIZACIÓN CON FAKESTORE API USANDO CAPACITOR HTTP
  // =========================================================
  async sincronizarUsuariosApi(): Promise<void> {
    if (this.apiSincronizada) return;
    await this.cargarHashesLocales();

    try {
      const response = await CapacitorHttp.get({
        url: this.apiUsersUrl,
        headers: { 'Content-Type': 'application/json' }
      });

      const usuariosApi = response.data as FakeStoreUser[];
      if (Array.isArray(usuariosApi)) {
        for (const u of usuariosApi) {
          const correo = u.email.trim().toLowerCase();
          const nombreCompleto = u.name
            ? `${u.name.firstname} ${u.name.lastname}`
            : u.username;

          const hash = await this.generarHashSha256(u.password);
          this.hashesUsuarios[correo] = hash;

          const existe = this.dataService
            .getUsuarios()
            .some(local => local.correo.trim().toLowerCase() === correo);

          if (!existe) {
            await this.dataService.registrarUsuario(nombreCompleto, correo, hash);
          }
        }
        await this.guardarHashesLocales();
      }
      this.apiSincronizada = true;
    } catch {
      // Opera con datos locales en Preferences si no hay red
    }
  }

  // =========================================================
  // 4. LOGIN CON HASH SHA-256 Y GENERACIÓN DE TOKEN
  // =========================================================
  async autenticar(correo: string, password: string): Promise<{ exito: boolean; mensaje: string; token?: string }> {
    await this.dataService.inicializarDesdePreferences();
    await this.sincronizarUsuariosApi();

    const correoLimpio = correo.trim().toLowerCase();
    const passwordHash = await this.generarHashSha256(password);

    // Verificar Administrador
    if (this.dataService.esAdministrador(correoLimpio, password.trim())) {
      const admin = this.dataService.getAdministrador();
      const token = await this.generarTokenSesion(correoLimpio);

      this.hashesUsuarios[correoLimpio] = passwordHash;
      await this.guardarHashesLocales();
      await this.dataService.setUsuarioActual(admin, token);

      return { exito: true, mensaje: 'Bienvenido, Administrador.', token };
    }

    // Buscar cliente
    const usuario = this.dataService
      .getUsuarios()
      .find(u => u.correo.trim().toLowerCase() === correoLimpio);

    if (!usuario) {
      return { exito: false, mensaje: 'El correo no está registrado.' };
    }

    const hashAlmacenado =
      this.hashesUsuarios[correoLimpio] ||
      (usuario.password.length === 64
        ? usuario.password
        : await this.generarHashSha256(usuario.password));

    if (hashAlmacenado !== passwordHash) {
      return { exito: false, mensaje: 'La contraseña ingresada es incorrecta.' };
    }

    const token = await this.generarTokenSesion(correoLimpio);
    this.hashesUsuarios[correoLimpio] = passwordHash;
    await this.guardarHashesLocales();
    await this.dataService.setUsuarioActual(usuario, token);

    return { exito: true, mensaje: `¡Bienvenido, ${usuario.nombre}!`, token };
  }

  // =========================================================
  // 5. REGISTRO CON CAPACITOR HTTP + TOKEN + AUTOLOGIN
  // =========================================================
  async registrarConApi(
    nombre: string,
    correo: string,
    password: string
  ): Promise<{ exito: boolean; mensaje: string; token?: string }> {
    await this.dataService.inicializarDesdePreferences();
    await this.sincronizarUsuariosApi();

    const correoLimpio = correo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();
    const passwordHash = await this.generarHashSha256(password);

    const usuarioCreado = await this.dataService.registrarUsuario(
      nombreLimpio,
      correoLimpio,
      passwordHash
    );

    if (!usuarioCreado) {
      return { exito: false, mensaje: 'Este correo ya se encuentra registrado.' };
    }

    const token = await this.generarTokenSesion(correoLimpio);

    this.hashesUsuarios[correoLimpio] = passwordHash;
    await this.guardarHashesLocales();

    // Guarda la sesión y el token inmediatamente para evitar pedir login otra vez
    await this.dataService.setUsuarioActual(usuarioCreado, token);

    // POST con CapacitorHttp a FakeStoreAPI (/users)
    try {
      await CapacitorHttp.post({
        url: this.apiUsersUrl,
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: correoLimpio,
          username: nombreLimpio.toLowerCase().replace(/\s+/g, '_'),
          password: passwordHash
        }
      });
    } catch {
      // Continúa aunque la API externa tarde
    }

    return { exito: true, mensaje: 'Cuenta creada e iniciada automáticamente.', token };
  }

  // =========================================================
  // 6. SINCRONIZAR CARRITO CON CAPACITOR HTTP (POST /carts)
  // =========================================================
  async sincronizarCarritoApi(
    userId: number,
    productos: Array<{ productId: number; quantity: number }>
  ): Promise<void> {
    try {
      await CapacitorHttp.post({
        url: this.apiCartsUrl,
        headers: { 'Content-Type': 'application/json' },
        data: {
          userId: userId || 1,
          date: new Date().toISOString().split('T')[0],
          products: productos
        }
      });
    } catch {
      // Respaldo offline silencioso
    }
  }
}