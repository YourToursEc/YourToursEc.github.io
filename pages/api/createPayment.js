// /api/createPayment.js (Ejemplo con Node.js y Express o en Vercel serverless function)
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, phoneNumber, clientTransactionId } = req.body;

  if (!amount || !phoneNumber || !clientTransactionId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const token = process.env.PAYPHONE_TOKEN;  // Tu token guardado en variables de entorno
  const storeId = process.env.PAYPHONE_STORE_ID;

  const paymentPayload = {
    storeId,
    clientTransactionId,
    amount,
    phoneNumber,
    // Otros parámetros según API PayPhone
  };

  try {
    const response = await fetch("https://api.payphonetodoesposible.com/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}

