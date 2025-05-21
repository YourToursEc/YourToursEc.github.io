// api/payphone.js

import fetch from 'node-fetch';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Método no permitido' });
  }

  const { region, destino, fecha, precio } = request.body;

  if (!region || !destino || !fecha || !precio) {
    return response.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const token = process.env.PAYPHONE_TOKEN;

    if (!token) {
      return response.status(500).json({ message: 'Token de PayPhone no configurado' });
    }

    const amountInCents = Math.round(precio * 100);

    const payphoneResponse = await fetch('https://sandbox.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInCents,
        amountWithoutTax: amountInCents,
        currency: "USD",
        clientTransactionId: `tour-${Date.now()}`,
        responseUrl: "https://yourtours.vercel.app/gracias",
        cancellationUrl: "https://yourtours.vercel.app/cancelado",
        reference: `Tour ${destino} - ${fecha}`
      })
    });

    const data = await payphoneResponse.json();

    if (!payphoneResponse.ok || !data.paymentUrl) {
      return response.status(500).json({ message: data.message || 'Error al crear el botón de pago' });
    }

    return response.status(200).json({ paymentUrl: data.paymentUrl });

  } catch (error) {
    console.error('Error en la API de PayPhone:', error);
    return response.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
