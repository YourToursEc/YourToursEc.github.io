export default async function handler(req, res) {
  const token = process.env.PAYPHONE_TOKEN;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const payphoneResponse = await fetch('https://pay.payphonetodoesposible.com/api/button/Prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await payphoneResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar pago' });
  }
}
