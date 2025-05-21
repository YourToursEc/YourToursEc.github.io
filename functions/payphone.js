// netlify/functions/payphone.js
const fetch = require('node-fetch'); // Si usas Netlify, node-fetch está disponible

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    const { region, destino, fecha, precio } = JSON.parse(event.body);

    if (!region || !destino || !fecha || !precio) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Faltan datos obligatorios' }),
      };
    }

    // Aquí pon tu token de PayPhone (usa variables de entorno para seguridad)
    const PAYPHONE_TOKEN = process.env.PAYPHONE_TOKEN;

    if (!PAYPHONE_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Token de PayPhone no configurado' }),
      };
    }

    // Cuerpo para crear la transacción de pago (ajusta según documentación PayPhone)
    const body = {
      // Ejemplo ficticio, debes adaptar según la API oficial PayPhone
      amount: precio,
      currency: "USD",
      description: `Pago tour a ${destino} (${region}) para la fecha ${fecha}`,
      callbackUrl: "https://tu-dominio.com/callback", // Tu URL para notificaciones
      successUrl: "https://tu-dominio.com/gracias",
      cancelUrl: "https://tu-dominio.com/cancelado",
    };

    const response = await fetch('https://api.payphone.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPHONE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Error en PayPhone', details: errorData }),
      };
    }

    const data = await response.json();

    // data debería contener la URL para redirigir al pago
    return {
      statusCode: 200,
      body: JSON.stringify({ paymentUrl: data.paymentUrl || data.url || '' }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno', error: error.message }),
    };
  }
};
