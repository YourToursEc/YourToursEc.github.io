const { createPayment } = require('payphone-node');
const cors = require('micro-cors')();

module.exports = cors(async (req, res) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      amount,
      amountWithoutTax,
      amountWithTax,
      tax,
      destination,
      experienceType,
      numPeople,
      travelDate
    } = await req.json();

    const payment = await createPayment({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      amount: parseInt(amount),
      amountWithoutTax: parseInt(amountWithoutTax),
      amountWithTax: parseInt(amountWithTax),
      tax: parseInt(tax),
      currency: "USD",
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: `Reserva para ${destination} (${experienceType}) - ${numPeople} persona${numPeople !== 1 ? 's' : ''} - Fecha: ${travelDate}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify(payment)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
});
