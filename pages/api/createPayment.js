// Ruta: /api/createPayment.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const token = process.env.PAYPHONE_TOKEN;     // Define en el entorno
  const storeId = process.env.PAYPHONE_STOREID; // Define en el entorno

  if (!token || !storeId) {
    return res.status(500).json({ message: 'Token o StoreId no configurado en el entorno' });
  }

  try {
    const {
      amount,
      amountWithoutTax,
      amountWithTax,
      tax,
      reference,
      clientTransactionId,
    } = req.body;

    // Crear solicitud a PayPhone API
    const response = await fetch('https://pay.payphonetodoesposible.com/api/button/v2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        amountWithoutTax,
        amountWithTax,
        tax,
        clientTransactionId,
        reference,
        currency: 'USD',
        storeId,
        responseUrl: 'https://tusitio.com/respuesta.html', // Cambia esto según tu sitio
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error al crear transacción', detalle: data });
    }

    // Devuelve datos para el botón o redirección
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}
