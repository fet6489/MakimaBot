// === Handler Premium Vinculación ===
const TOKENS_PREMIUM = ['MAK1', 'KENN1', 'HTTPS', 'BOTPREM', 'CODEBOT']

let handlerPremium = async (m, { conn, args, usedPrefix, command }) => {
  // 1. Pide token
  if (!args[0]) {
    return conn.reply(m.chat, 'Tienes que ingresar un token.', m)
  }
  const token = args[0].toUpperCase().trim()
  // 2. Valida token
  if (!TOKENS_PREMIUM.includes(token)) {
    return conn.reply(m.chat, 'Este token no es valido.', m)
  }
  // 3. Mensaje de envío
  await conn.reply(m.chat, 'Enviando código de vinculación premium...', m)

  // 4. Lógica de vinculación premium
  // Carpeta de sesiones premium = carpeta Session de subbots
  const id = m.sender.split('@')[0]
  const pathPremium = path.join('./Session/', id)
  if (!fs.existsSync(pathPremium)) fs.mkdirSync(pathPremium, { recursive: true })

  // Opciones para pasar a blackJadiBot (reutiliza tu función actual)
  blackJadiBot({
    pathblackJadiBot: pathPremium,
    m, conn, args: [], // args vacío para que pida QR/código
    usedPrefix, command: 'code',
    fromCommand: true,
    isPremium: true // Puedes usar esto para diferenciar si quieres
  })
}

handlerPremium.help = ['codepremium <token>']
handlerPremium.tags = ['serbot']
handlerPremium.command = ['codepremium']
export default handlerPremium