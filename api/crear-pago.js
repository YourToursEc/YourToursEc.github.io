const { createPayment } = require('payphone-node');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { amount, destino, personas, fecha } = req.body;

    const paymentData = await createPayment({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      amount: amount,
      currency: "USD",
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: `Reserva ${destino} - ${personas} pers. - ${fecha}`,
      amountWithoutTax: Math.round(amount * 0.85),
      amountWithTax: Math.round(amount * 0.15),
      tax: Math.round(amount * 0.12)
    });

    res.status(200).json(paymentData);
    
  } catch (error) {
    console.error('Error en el pago:', error);
    res.status(500).json({ 
      error: 'Error al procesar el pago',
      details: error.message 
    });
  }
}
