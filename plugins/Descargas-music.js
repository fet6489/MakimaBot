/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado y mejorado por
- ReyEndymion >> https://github.com/ReyEndymion
El codigo de este archivo esta inspirado en el codigo original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

const TOKENS_PREMIUM = ['MAK1', 'KENN1', 'HTTPS', 'BOTPREM', 'CODEBOT']
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import * as ws from 'ws'
import { makeWASocket } from '../lib/simple.js'

// === HANDLER PREMIUM ===
let handlerPremium = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Tienes que ingresar un token.', m)
  const token = args[0].toUpperCase().trim()
  if (!TOKENS_PREMIUM.includes(token)) return conn.reply(m.chat, 'Este token no es valido.', m)
  await conn.reply(m.chat, 'Conexión premium', m)

  let id = m.sender.split('@')[0]
  let pathPremium = path.join('./Session/', id)
  if (!fs.existsSync(pathPremium)) fs.mkdirSync(pathPremium, { recursive: true })

  blackJadiBot({
    pathblackJadiBot: pathPremium,
    m, conn,
    args: [], // fuerza pairing code
    command: 'code',
    fromCommand: true,
    isPremium: true,
  })
}
handlerPremium.help = ['codepremium <token>']
handlerPremium.tags = ['serbot']
handlerPremium.command = ['codepremium']
export { handlerPremium as default }

// === HANDLER SUBBOTS CLÁSICO (NO TOQUES) ===
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `🕐 Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
  const subBotsCount = subBots.length
  if (subBotsCount === 30) {
    return m.reply(`No se han encontrado servidores para *Sub-Bots* disponibles.`)
  }
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  let pathblackJadiBot = path.join(`./Session/`, id)
  if (!fs.existsSync(pathblackJadiBot)){
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  let blackJBOptions = {
    pathblackJadiBot,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand: true,
    isPremium: false
  }
  blackJadiBot(blackJBOptions)
  global.db.data.users[m.sender].Subs = new Date * 1
}
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export { handler as handlerSubBots }

// === FUNCIÓN DE VINCULACIÓN (PREMIUM + SUBBOTS) ===
export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, command, isPremium } = options

  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false

  let txtCode, codeBot, txtQR
  let rtx = isPremium
    ? "*︰꯭𞋭💎 CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO PREMIUM\n\n✰ Sigue los pasos para vincular tu bot premium:\n\n1️⃣ Ve a WhatsApp Web o tu app.\n2️⃣ Toca en Dispositivos vinculados.\n3️⃣ Selecciona 'Vincular con el número de teléfono'.\n4️⃣ Ingresa este código PREMIUM de 8 dígitos.\n\n★ Este código es exclusivo para tu sesión premium."
    : "*︰꯭𞋭💎 CONEXIÓN SUBBOT*\n\n━⧽ MODO CÓDIGO QR\n\n✰ Sigue los pasos para vincular tu sub-bot:\n\n1️⃣ Ve a WhatsApp Web o tu app.\n2️⃣ Toca en Dispositivos vinculados.\n3️⃣ Escanea este QR.\n\n★ El QR expira a los 45 segundos."
  let rtx2 = rtx

  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)){
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    conn.reply(m.chat, `Use correctamente el comando`, m)
    return
  }

  let { version } = await fetchLatestBaileysVersion()
  const msgRetry = (MessageRetryMap) => { }
  const msgRetryCache = new NodeCache()
  const { state } = await useMultiFileAuthState(pathblackJadiBot)

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
    msgRetry,
    msgRetryCache,
    browser: mcode ? ['Makima Premium', 'Chrome', '2.0.0'] : ['Makima (Sub Bot)', 'Chrome','2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  }
  let sock = makeWASocket(connectionOptions)

  sock.ev.on("connection.update", async (update) => {
    const { qr } = update
    // --- Vinculación PREMIUM (código 8 dígitos) ---
    if (mcode) {
      let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
      secret = secret.match(/.{1,4}/g)?.join("-")
      await m.reply(secret)
      return
    }
    // --- Vinculación normal (QR) ---
    if (qr && !mcode) {
      if (m?.chat) {
        txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m})
      }
      if (txtQR && txtQR.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
      }
    }
  })
}

// ========== UTILIDAD DE TIEMPO ===========
function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}