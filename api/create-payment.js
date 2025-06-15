const { createPayment } = require('payphone-node');
const cors = require('micro-cors')();

module.exports = cors(async (req, res) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = await req.json();
    const payment = await createPayment({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      clientTransactionId: `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: body.amount,
      amountWithoutTax: body.amountWithoutTax,
      amountWithTax: body.amountWithTax,
      tax: body.tax,
      currency: "USD",
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: body.reference
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
