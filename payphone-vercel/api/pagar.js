// api/pagar.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = process.env.PAYPHONE_TOKEN; // tu token guardado en variables de entorno
  const body = req.body;

  try {
    // Ejemplo: llamas a PayPhone con fetch usando token y body que recibes
    const response = await fetch("https://api.payphonetodoesposible.com/endpointPago", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
  }
}
