const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { region, destino, fecha, precio } = JSON.parse(event.body);

    const token = process.env.PAYPHONE_TOKEN; // ← 👈 así lo leemos seguro
    const apiUrl = "https://pay.payphonetodoesposible.com/api/Sale";

    const body = {
      amount: Math.round(precio * 100),
      amountWithoutTax: Math.round(precio * 100),
      currency: "USD",
      clientTransactionId: Date.now().toString(),
      responseUrl: "https://tusitio.com/exito",
      cancellationUrl: "https://tusitio.com/error"
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ message: data.message || 'Error en PayPhone' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentUrl: data.payWithPayPhoneUrl })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
