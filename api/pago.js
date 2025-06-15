module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { amount, destino, personas, fecha } = req.body;

    res.status(200).json({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      amount: amount,
      currency: "USD",
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: `Reserva ${destino} - ${personas} pers. - ${fecha}`
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al generar pago',
      details: error.message 
    });
  }
}
