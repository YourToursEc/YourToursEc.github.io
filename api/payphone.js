const axios = require('axios');

module.exports = async (req, res) => {
  // Configura CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { 
      amount,
      amountWithoutTax,
      amountWithTax,
      tax,
      reference,
      currency
    } = req.body;

    // Validaciones
    if (!amount || !reference) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const response = await axios.post('https://api.payphone.io/v2/payment', {
      storeId: process.env.PAYPHONE_STORE_ID,
      amount,
      amountWithoutTax,
      amountWithTax,
      tax,
      currency: currency || "USD",
      reference,
      clientTransactionId: `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }, {
      headers: {
        'Authorization': process.env.PAYPHONE_PRIVATE_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      success: true,
      token: response.data.token,
      clientTransactionId: response.data.clientTransactionId
    });

  } catch (error) {
    console.error('Error en Payphone:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: 'Error al procesar el pago',
      details: error.response?.data || error.message
    });
  }
};
