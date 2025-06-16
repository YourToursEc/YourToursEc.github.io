// api/confirm-payphone.js

export default async function handler(request, response) {
  // Manejar preflight request (OPTIONS) para CORS
  if (request.method === 'OPTIONS') {
    // Permite solicitudes desde cualquier origen para pruebas.
    // EN PRODUCCIÓN, CAMBIA '*' por el dominio exacto de tu frontend (ej: 'https://yourtoursec.github.io' o 'https://your-vercel-project-name.vercel.app').
    response.setHeader('Access-Control-Allow-Origin', '*'); 
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Max-Age', '86400'); // Cachea la respuesta de preflight por 24 horas
    return response.status(204).end(); // Responde con "No Content" para preflight
  }

  // Asegúrate de que solo las solicitudes POST sean procesadas
  if (request.method !== 'POST') {
    // Aquí también, sé específico con el origen en producción.
    response.setHeader('Access-Control-Allow-Origin', '*'); 
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Configura los encabezados CORS para la respuesta real de POST
  // Aquí también, sé específico con el origen en producción.
  response.setHeader('Access-Control-Allow-Origin', '*'); 
  response.setHeader('Access-Control-Allow-Methods', 'POST'); // Solo POST para la respuesta real
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { id, clientTxId } = request.body;

    if (!id || !clientTxId) {
      return response.status(400).json({ error: 'Faltan parámetros: id o clientTxId.' });
    }

    // Accede a tu token de PayPhone desde las variables de entorno de Vercel
    // IMPORTANTE: Asegúrate de configurar 'PAYPHONE_BEARER_TOKEN' en la configuración de tu proyecto Vercel.
    const PAYPHONE_BEARER_TOKEN = process.env.PAYPHONE_BEARER_TOKEN;

    if (!PAYPHONE_BEARER_TOKEN) {
      console.error("PAYPHONE_BEARER_TOKEN no está configurado en las variables de entorno de Vercel.");
      return response.status(500).json({ error: 'Error de configuración del servidor: Token no encontrado.' });
    }

    const payphoneResponse = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYPHONE_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        clientTxId: clientTxId
      })
    });

    // PayPhone puede devolver respuestas 4xx/5xx que también contienen JSON.
    // Leemos el cuerpo JSON de la respuesta de PayPhone.
    const payphoneData = await payphoneResponse.json();

    // Devuelve la respuesta completa de PayPhone al frontend, manteniendo el mismo status code.
    return response.status(payphoneResponse.status).json(payphoneData);

  } catch (error) {
    console.error('Error en la API Route:', error);
    // Un error general del servidor. Podrías querer ser más específico aquí en producción.
    return response.status(500).json({ error: 'Error interno del servidor.', details: error.message });
  }
}
