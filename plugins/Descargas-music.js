// ================== Handler Premium Vinculación =======================
const TOKENS_PREMIUM = ['MAK1', 'KENN1', 'HTTPS', 'BOTPREM', 'CODEBOT']

let handlerPremium = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, 'Tienes que ingresar un token.', m)
  }
  const token = args[0].toUpperCase().trim()
  if (!TOKENS_PREMIUM.includes(token)) {
    return conn.reply(m.chat, 'Este token no es valido.', m)
  }
  await conn.reply(m.chat, 'Enviando código de vinculación premium...', m)

  // Carpeta Session para premium igual que subbots
  let id = m.sender.split('@')[0]
  let pathPremium = path.join('./Session/', id)
  if (!fs.existsSync(pathPremium)) fs.mkdirSync(pathPremium, { recursive: true })

  // Llama a blackJadiBot con isPremium true
  blackJadiBot({
    pathblackJadiBot: pathPremium,
    m, conn, args: [], // Para que caiga en modo pairing code
    usedPrefix,
    command: 'code',
    fromCommand: true,
    isPremium: true, // Bandera premium
  })
}

handlerPremium.help = ['codepremium <token>']
handlerPremium.tags = ['serbot']
handlerPremium.command = ['codepremium']
export default handlerPremium


// ================== Adaptación en blackJadiBot =======================
// Busca esta parte en tu blackJadiBot original y reemplaza los textos así:

export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command, isPremium } = options
  if (command === 'code') {
    command = 'qr'; 
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR

  // -- Personalización PREMIUM --
  let rtx = isPremium
    ? "*︰꯭𞋭💎 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO QR PREMIUM\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n• En la Pc o tu otro teléfono escanea este qr.\n\n➪ Toca en dispositivos vinculados.\n\n➪ Selecciona Vincular con el número de teléfono.\n\n➪ Escanea el código QR.\n\n★ 𝗡𝗼𝘁𝗮: Este código expira después de los 45 segundos (Premium)."
    : "*︰꯭𞋭💎 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT*\n\n━⧽ MODO CODIGO QR\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n• En la Pc o tu otro teléfono escanea este qr.\n\n➪ Toca en dispositivos vinculados.\n\n➪ Selecciona Vincular con el número de teléfono.\n\n➪ Escanea el código QR.\n\n★ 𝗡𝗼𝘁𝗮: Este código expira después de los 45 segundos."
  let rtx2 = isPremium
    ? "*︰꯭𞋭💎 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO PREMIUM\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n➪ Ve a la esquina superior derecha.\n\n➪ Toca en dispositivos vinculados.\n\n➪ Selecciona Vincular con el número de teléfono.\n\n➪ Pega el siguiente código PREMIUM que te enviaremos.\n\n★ 𝗡𝗼𝘁𝗮: 𝖤𝗌𝗍𝖾 𝖼𝗈𝖽𝗂𝗀𝗈 solo funciona para tu sesión premium."
    : "*︰꯭𞋭💎 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT*\n\n━⧽ MODO CODIGO\n\n✰ 𝖯𝖺𝗌𝗈𝗌 𝖽𝖾 𝗏𝗂𝗇𝖼𝗎𝗅𝖺𝖼𝗂𝗈́𝗇:\n\n➪ Ve a la esquina superior derecha.\n\n➪ Toca en dispositivos vinculados.\n\n➪ Selecciona Vincular con el número de teléfono.\n\n➪ Pega el siguiente código que te enviaremos.\n\n★ 𝗡𝗼𝘁𝗮: 𝖤𝗌𝗍𝖾 𝖼𝗈𝖽𝗂𝗀𝗈 𝗌𝗈𝗅𝗈 𝖿𝗎𝗇𝖼𝗂𝗈𝗇𝖺 𝖾𝗇 𝖾𝗅 𝗇𝗎́𝗆𝖾𝗋𝗈 𝗊𝗎𝖾 𝗅𝗈 𝗌𝗈𝗅𝗂𝖼𝗂𝗍𝗈́."

  // (El resto de blackJadiBot igual que tu código original, solo cambia rtx/rtx2 donde se use.)
  // Ejemplo de uso en generación de QR/código:
  // ...
  if (qr && !mcode) {
    if (m?.chat) {
      txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m})
    } else {
      return 
    }
    if (txtQR && txtQR.key) {
      setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
    }
    return
  }
  if (qr && mcode) {
    let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
    secret = secret.match(/.{1,4}/g)?.join("-")
    txtCode = await conn.sendMessage(m.chat, {text: rtx2}, { quoted: m })
    codeBot = await m.reply(secret)
    console.log(secret)
  }
  // ...
  // (El resto de tu lógica sin cambios, solo asegúrate de usar rtx/rtx2 según corresponda)

  // Fin blackJadiBot adaptado para premium
}