module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Simplemente devuelve los datos para el frontend
    const { amount } = req.body;
    
    res.json({
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      amount: amount,
      currency: "USD"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
