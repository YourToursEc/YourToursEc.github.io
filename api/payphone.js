export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { region, destino, fecha, precio } = req.body;

  if (!region || !destino || !fecha || !precio) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    const token = process.env.PAYPHONE_TOKEN; // <- guarda tu token en Vercel (Settings > Environment Variables)

    const response = await fetch('https://pay.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(precio * 100), // PayPhone espera centavos
        amountWithoutTax: Math.round(precio * 100),
        currency: "USD",
        clientTransactionId: `tour-${Date.now()}`,
        responseUrl: "https://yourtours.vercel.app/gracias", // <- cambia esto por tu página de gracias o confirmación
        cancellationUrl: "https://yourtours.vercel.app/cancelado", // <- opcional
        reference: `Tour ${destino} - ${fecha}`,
        storeId: "YOUR_STORE_ID" // <- Opcional, si te lo pide PayPhone
      })
    });

    const data = await response.json();

    if (!response.ok || !data.paymentUrl) {
      throw new Error(data.message || 'Error al crear el botón de pago');
    }

    return res.status(200).json({ paymentUrl: data.paymentUrl });

  } catch (error) {
    console.error('Error en la API de PayPhone:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
