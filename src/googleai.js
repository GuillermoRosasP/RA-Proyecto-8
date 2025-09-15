/**
 * src/googleai.js
 * - Lógica para llamar al endpoint de Generative Language (Google AI Studio / Gemini).
 * - Usa el endpoint que mostraste en el curl: gemini-2.0-flash:generateContent.
 * - Pasos:
 *    1) Construir URL y headers (incluyendo X-goog-api-key).
 *    2) Enviar POST con body { contents: [{ parts: [{ text: ... }] }] }.
 *    3) Parsear la respuesta y devolver el texto candidato principal (con varios fallbacks).
 *
 * Nota: guarda tu API key en .env como:
 *   VITE_GOOGLE_API_KEY=TU_API_KEY_AQUI
 * y reinicia Vite después de editar .env.
 */

export async function sendMsgToGoogleAi(userInput) {
  // userInput: string con el texto del usuario que queremos enviar al modelo. <-- propósito
  try {
    // Endpoint oficial (modelo gemini-2.0-flash)
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"; // url: endpoint para generar contenido

    // Headers: usamos X-goog-api-key tal como en el curl de ejemplo
    const headers = {
      "Content-Type": "application/json", // header Content-Type: indicamos JSON
      "X-goog-api-key": import.meta.env.VITE_GOOGLE_API_KEY, // X-goog-api-key: clave desde .env
    }; // headers: objeto con los encabezados HTTP

    // Request body siguiendo el formato del ejemplo (puedes añadir temperature, maxOutputTokens, etc.)
    const requestBody = {
      contents: [
        {
          parts: [{ text: userInput }], // parts: arreglo con el texto que enviaremos
        },
      ],
      // Opcionales que puedes ajustar:
      // temperature: 0.2,
      // candidateCount: 1,
      // maxOutputTokens: 512,
    }; // requestBody: cuerpo JSON de la petición

    // Hacemos fetch al endpoint
    const response = await fetch(url, {
      method: "POST", // method: POST para generar contenido
      headers, // headers: incluidos arriba
      body: JSON.stringify(requestBody), // body: stringify del requestBody
    }); // response: objeto Response de la petición

    // Si la respuesta no fue OK, parseamos y lanzamos error con info útil
    if (!response.ok) {
      const errText = await response.text(); // errText: texto del body de error
      throw new Error(`Google AI error: ${response.status} ${errText}`); // lanzamos error con código y body
    }

    // Parseamos JSON de la respuesta
    const data = await response.json(); // data: respuesta JSON parseada

    // Extraemos el texto candidato con varios fallbacks según la estructura posible
    const output =
      // estructura frecuente: data.candidates[0].content.parts[0].text
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      // otra posible ruta: data.outputs[0].content.parts[0].text
      data?.outputs?.[0]?.content?.parts?.[0]?.text ||
      // otras variantes: candidates[0].outputText (por si existe)
      data?.candidates?.[0]?.outputText ||
      // fallback: si la respuesta tiene un campo 'text' en outputs
      data?.outputs?.[0]?.text ||
      // si nada coincide, devolvemos un resumen del objeto para debugging
      JSON.stringify(data).slice(0, 300) || // output: texto final a devolver (limité al principio si es muy largo)
      "No recibí respuesta 😢"; // fallback final

    return output; // devolver el texto al llamador
  } catch (error) {
    // Mostrar en consola para debug
    console.error("Error en sendMsgToGoogleAi:", error); // log del error
    // Devolver mensaje amigable para la UI
    return "Ocurrió un error al conectar con Google AI 😢"; // mensaje que verá el usuario
  }
}
