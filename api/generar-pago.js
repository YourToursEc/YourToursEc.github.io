const { payphone } = require('./config')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { amount, destino, personas, fecha } = req.body

    const paymentData = {
      token: payphone.token,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      amount: amount,
      amountWithoutTax: Math.round(amount * 0.8),
      amountWithTax: Math.round(amount * 0.2),
      tax: Math.round(amount * 0.12),
      currency: "USD",
      storeId: payphone.storeId,
      reference: `Reserva ${destino} (${personas} pers.) - ${fecha}`
    }

    res.status(200).json(paymentData)
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al generar pago',
      details: error.message 
    })
  }
}
