export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { region, destino, fecha } = req.body;

  if (!region || !destino || !fecha) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  // Precios base según destino
  const preciosBase = {
    "Cuenca": 180,
    "Cotopaxi": 49,
    "Chimborazo": 39
    // Puedes agregar más destinos si los defines en frontend también
  };

  // Validación de destino
  const precioBase = preciosBase[destino];
  if (!precioBase) {
    return res.status(400).json({ message: 'Destino no válido o sin precio definido' });
  }

  // Aplica recargo del 7%
  const precioConRecargo = Math.round(precioBase * 1.07 * 100); // en centavos

  try {
    const token = process.env.PAYPHONE_TOKEN; // Token de PRUEBAS

    const response = await fetch('https://sandbox.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: precioConRecargo,
        amountWithoutTax: precioConRecargo,
        currency: "USD",
        clientTransactionId: `tour-${Date.now()}`,
        responseUrl: "https://yourtours.vercel.app/gracias",
        cancellationUrl: "https://yourtours.vercel.app/cancelado",
        reference: `Tour ${destino} - ${fecha}`
        // storeId: "TU_STORE_ID" // solo si te lo dieron
      })
    });

    const data = await response.json();

    if (!response.ok || !data.paymentUrl) {
      throw new Error(data.message || 'Error al crear el botón de pago');
    }

    return res.status(200).json({ paymentUrl: data.paymentUrl });

  } catch (error) {
    console.error('Error en PayPhone:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}
