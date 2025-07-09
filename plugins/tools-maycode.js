const premiumTokens = Array.from({length: 10}, (_, i) => `MAK${i+1}`);
global.usedPremiumTokens = global.usedPremiumTokens || {};

import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import * as ws from 'ws';
import { makeWASocket } from '../lib/simple.js';
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { fileURLToPath } from 'url';

// Mensajes premium
const rtx = "*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT PREMIUM*\n\n━⧽ MODO CODIGO QR PREMIUM\n\n✰ Pasos de vinculación:\n\n• Escanea este QR en WhatsApp Web.\n• Disfruta de tu SubBot premium.";
const rtx2 = "*︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT PREMIUM*\n\n━⧽ MODO CODIGO PREMIUM\n\n✰ Pasos de vinculación:\n\n• Pega este código en WhatsApp Web.\n• Disfruta de tu SubBot premium.";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!['codepremium', 'qrpremium'].includes(command)) return;

  let time = global.db.data.users[m.sender].Subs + 120000;
  if (new Date - global.db.data.users[m.sender].Subs < 120000)
    return conn.reply(m.chat, `🕐 Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot Premium.*`, m);

  // Token control
  if (!args[0]) return conn.reply(m.chat, "Ingresa un token", m);
  const token = args[0].trim().toUpperCase();
  if (!premiumTokens.includes(token))
    return conn.reply(m.chat, "Este token no está en mi base de datos", m);
  if (global.usedPremiumTokens[token])
    return conn.reply(m.chat, "Este token ya está ocupado, ingresa un token válido", m);

  global.usedPremiumTokens[token] = m.sender;
  await conn.reply(m.chat, "Token correcto enviando vinculación", m);

  // Vinculación premium usando la carpeta global.Sessions
  let who = m.sender;
  let id = `${who.split`@`[0]}`;
  let pathPremium = path.join(global.Sessions, id);
  if (!fs.existsSync(pathPremium)) fs.mkdirSync(pathPremium, { recursive: true });

  blackPremium({ pathPremium, m, conn, command });

  global.db.data.users[m.sender].Subs = new Date * 1;
};
handler.help = ['qrpremium <TOKEN>', 'codepremium <TOKEN>'];
handler.tags = ['premium'];
handler.command = ['qrpremium', 'codepremium'];
export default handler;

async function blackPremium({ pathPremium, m, conn, command }) {
  let codeMode = command === 'codepremium';

  let { version } = await fetchLatestBaileysVersion();
  const msgRetryCache = new NodeCache();
  const { state, saveState, saveCreds } = await useMultiFileAuthState(pathPremium);

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetry: () => {},
    msgRetryCache,
    browser: codeMode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Makima Premium', 'Chrome', '2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  };

  let sock = makeWASocket(connectionOptions);
  sock.ev.on('connection.update', async (update) => {
    const { connection, isNewLogin, qr } = update;
    if (connection === 'open') {
      await conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]}, Te conectaste a Makima Premium con éxito.`, mentions: [m.sender] }, { quoted: m });
      global.conns.push(sock);
    }
    if (qr && !codeMode) {
      let txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m });
      if (txtQR && txtQR.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000);
    }
    if (qr && codeMode) {
      let secret = await sock.requestPairingCode((m.sender.split`@`[0]));
      secret = secret.match(/.{1,4}/g)?.join("-");
      let txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
      let codeBot = await m.reply(secret);
      if (txtCode && txtCode.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000);
      if (codeBot && codeBot.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000);
    }
  });

  setInterval(async () => {
    if (!sock.user) {
      try { sock.ws.close(); } catch (e) {}
      sock.ev.removeAllListeners();
      let i = global.conns.indexOf(sock);
      if (i < 0) return;
      delete global.conns[i];
      global.conns.splice(i, 1);
    }
  }, 60000);
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  return minutes + ' m y ' + seconds + ' s ';
}