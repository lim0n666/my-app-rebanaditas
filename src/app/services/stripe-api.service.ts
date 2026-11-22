import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';

export interface RespuestaStripe {
  exito: boolean;
  idTransaccion: string;
  estado: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class StripeApiService {
  private readonly baseUrl = 'https://api.stripe.com/v1';
  // Pega aquí tu llave secreta de pruebas de Stripe (empieza con sk_test_...)
  private readonly secretKey = 'sk_test_TU_LLAVE_DE_PRUEBA_AQUI';

  async crearIntentoPago(
    montoMxn: number,
    descripcion: string,
    numeroTarjeta: string
  ): Promise<RespuestaStripe> {
    const limpia = numeroTarjeta.replace(/\s+/g, '');

    // Mapeo de tarjetas de prueba oficiales de Stripe
    const paymentMethod = limpia.startsWith('4000')
      ? 'pm_card_chargeDeclined'
      : 'pm_card_visa';

    // Si aún no configuras tu llave sk_test_, simula la respuesta con estructura oficial de Stripe
    if (!this.secretKey || this.secretKey.includes('TU_LLAVE')) {
      if (paymentMethod === 'pm_card_chargeDeclined') {
        return {
          exito: false,
          idTransaccion: '',
          estado: 'requires_payment_method',
          mensaje: 'Tu tarjeta fue declinada por el banco emisor (Stripe Sandbox).'
        };
      }
      return {
        exito: true,
        idTransaccion: 'pi_test_' + Math.floor(100000000 + Math.random() * 900000000),
        estado: 'succeeded',
        mensaje: 'Pago confirmado vía Stripe Sandbox.'
      };
    }

    const montoCentavos = Math.max(1000, Math.round(montoMxn * 100));
    const body = new URLSearchParams({
      amount: String(montoCentavos),
      currency: 'mxn',
      payment_method: paymentMethod,
      confirm: 'true',
      description: descripcion,
      'automatic_payment_methods[enabled]': 'true',
      'automatic_payment_methods[allow_redirects]': 'never'
    }).toString();

    try {
      const response = await CapacitorHttp.post({
        url: `${this.baseUrl}/payment_intents`,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: body
      });

      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (response.status >= 200 && response.status < 300 && data?.status === 'succeeded') {
        return {
          exito: true,
          idTransaccion: data.id, // Ej: pi_3Qxxxxxxxxxxxxxx
          estado: data.status,
          mensaje: 'Pago aprobado por Stripe API.'
        };
      }

      return {
        exito: false,
        idTransaccion: data?.id || '',
        estado: data?.status || 'failed',
        mensaje: data?.error?.message || 'Stripe rechazó el intento de pago.'
      };
    } catch {
      return {
        exito: false,
        idTransaccion: '',
        estado: 'network_error',
        mensaje: 'No se pudo conectar con la API de Stripe.'
      };
    }
  }
}