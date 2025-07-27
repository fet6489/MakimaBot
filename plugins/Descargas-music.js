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

// ======== IMPORTACIONES Y VARIABLES PRINCIPALES ==========
const TOKENS_PREMIUM = ['MAK1', 'KENN1', 'HTTPS', 'BOTPREM', 'CODEBOT']
const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const blackJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

// ========== HANDLER PREMIUM ==============
let handlerPremium = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, 'Tienes que ingresar un token.', m)
  const token = args[0].toUpperCase().trim()
  if (!TOKENS_PREMIUM.includes(token)) return conn.reply(m.chat, 'Este token no es valido.', m)
  await conn.reply(m.chat, 'Enviando código de vinculación premium...', m)

  let id = m.sender.split('@')[0]
  let pathPremium = path.join('./Session/', id)
  if (!fs.existsSync(pathPremium)) fs.mkdirSync(pathPremium, { recursive: true })

  blackJadiBot({
    pathblackJadiBot: pathPremium,
    m, conn, args: [], // fuerza pairing code
    usedPrefix,
    command: 'code',
    fromCommand: true,
    isPremium: true,
  })
}
handlerPremium.help = ['codepremium <token>']
handlerPremium.tags = ['serbot']
handlerPremium.command = ['codepremium']
export { handlerPremium as default } // Exporta como plugin

// ========== HANDLER DE SUBBOTS NORMAL (NO TOQUES) ===========
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
blackJBOptions.pathblackJadiBot = pathblackJadiBot
blackJBOptions.m = m
blackJBOptions.conn = conn
blackJBOptions.args = args
blackJBOptions.usedPrefix = usedPrefix
blackJBOptions.command = command
blackJBOptions.fromCommand = true
blackJadiBot(blackJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']

// ========== FUNCIÓN PRINCIPAL ADAPTADA PARA PREMIUM ==============
export async function blackJadiBot(options) {
let { pathblackJadiBot, m, conn, args, usedPrefix, command, isPremium } = options
if (command === 'code') {
  command = 'qr'; 
  args.unshift('code')
}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR

// ======= TEXTOS PREMIUM Y SUBBOT ===========
let rtx = isPremium
  ? "*︰꯭𞋭💎 CONEXIÓN PREMIUM*\n\n━⧽ MODO CÓDIGO PREMIUM\n\n✰ Sigue los pasos para vincular tu bot premium:\n\n1️⃣ Ve a WhatsApp Web o tu app.\n2️⃣ Toca en Dispositivos vinculados.\n3️⃣ Selecciona 'Vincular con el número de teléfono'.\n4️⃣ Ingresa este código PREMIUM de 8 dígitos.\n\n★ Este código es exclusivo para tu sesión premium."
  : "*︰꯭𞋭💎 CONEXIÓN SUBBOT*\n\n━⧽ MODO CÓDIGO QR\n\n✰ Sigue los pasos para vincular tu sub-bot:\n\n1️⃣ Ve a WhatsApp Web o tu app.\n2️⃣ Toca en Dispositivos vinculados.\n3️⃣ Escanea este QR.\n\n★ El QR expira a los 45 segundos."
let rtx2 = rtx

const pathCreds = path.join(pathblackJadiBot, "creds.json")
if (!fs.existsSync(pathblackJadiBot)){
  fs.mkdirSync(pathblackJadiBot, { recursive: true })}
try {
  args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
  conn.reply(m.chat, `Use correctamente el comando » ${usedPrefix + command} code`, m)
  return
}

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathblackJadiBot)

const connectionOptions = {
  logger: pino({ level: "fatal" }),
  printQRInTerminal: false,
  auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
  msgRetry,
  msgRetryCache,
  browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Makima (Sub Bot)', 'Chrome','2.0.0'],
  version: version,
  generateHighQualityLinkPreview: true
};

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin, qr } = update
  if (isNewLogin) sock.isInit = false
  // --- QR NORMAL SUBBOT ---
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
  // --- PAIRING CODE 8 DÍGITOS PREMIUM (O 'code') ---
  if (qr && mcode) {
    let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
    secret = secret.match(/.{1,4}/g)?.join("-")
    txtCode = await conn.sendMessage(m.chat, {text: rtx2}, { quoted: m })
    codeBot = await m.reply(secret)
    console.log(secret)
  }
  if (txtCode && txtCode.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
  }
  if (codeBot && codeBot.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
  }
  // ... resto de tu lógica de conexión igual ...
}

sock.ev.on("connection.update", connectionUpdate)

// ... resto de tu función blackJadiBot original ...
}

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

// Exporta el handler de subbots normal también para compatibilidad
export { handler as handlerSubbots }