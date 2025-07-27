// Código creado por Félix para Sistema de Makima
// No quites créditos

let palabrasClave = [
  /makima/i,
  /\bmaki\b/i,
  /\bbot\b/i,
  /subbot/i,
  /noc/i,
  /cosz/i,
  /\bzi\b/i,
  /zes salazar/i
]

// Lista de reacciones (emojis) posibles
let emojisReaccion = ['🩵', '💥', '💠', '💎', '😥', '😊', '😀', '🗣️', '🤤', '🚨']

let handler = async function (m, { conn }) {
  if (!m.text) return // Ignora mensajes sin texto

  for (let palabra of palabrasClave) {
    if (palabra.test(m.text)) {
      // Escoge un emoji aleatorio de la lista
      let emoji = emojisReaccion[Math.floor(Math.random() * emojisReaccion.length)]
      try {
        await m.react(emoji)
        break // Solo una reacción por mensaje
      } catch (e) { }
    }
  }
}

handler.all = true // Detector automático
export default handler