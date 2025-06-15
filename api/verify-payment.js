const { verifyPayment } = require('payphone-node');
const cors = require('micro-cors')();

module.exports = cors(async (req, res) => {
  if (req.method !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { transactionId } = await req.json();
    const verification = await verifyPayment({
      token: process.env.PAYPHONE_PRIVATE_KEY,
      transactionId
    });

    return {
      statusCode: 200,
      body: JSON.stringify(verification)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
});
