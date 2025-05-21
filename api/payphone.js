export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { region, destino, fecha, precio } = req.body;

  if (!region || !destino || !fecha || !precio) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const token = process.env.PAYPHONE_TOKEN; // Token sandbox en variables de entorno

    if (!token) {
      return res.status(500).json({ message: 'Token de PayPhone no configurado' });
    }

    // Preparar el monto en centavos y aplicar recargo si quieres (aquí se asume que precio ya incluye recargo)
    const amountInCents = Math.round(precio * 100);

    const response = await fetch('https://sandbox.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // <- Aquí está el Bearer obligatorio
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
        // storeId: "TU_STORE_ID" // Opcional
      })
    });

    const data = await response.json();

    if (!response.ok || !data.paymentUrl) {
      return res.status(500).json({ message: data.message || 'Error al crear el botón de pago' });
    }

    return res.status(200).json({ paymentUrl: data.paymentUrl });

  } catch (error) {
    console.error('Error en la API de PayPhone:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
