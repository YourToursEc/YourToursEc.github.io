const express = require('express');
const cors = require('cors');
const { createPayment } = require('payphone-node');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de pago
app.post('/', async (req, res) => {
  try {
    // Validar método HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { amount, amountWithoutTax, amountWithTax, tax, reference } = req.body;

    // Crear pago
    const payment = await createPayment({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: amount,
      amountWithoutTax: amountWithoutTax,
      amountWithTax: amountWithTax,
      tax: tax,
      currency: "USD",
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: reference
    });

    // Respuesta exitosa
    res.status(200).json(payment);

  } catch (error) {
    // Manejo de errores
    console.error('Error en create-payment:', error);
    res.status(500).json({ 
      error: error.message || 'Error al procesar el pago' 
    });
  }
});

module.exports = app;
