// Código creado por Félix para Sistema de Makima
// No quites créditos

import ws from 'ws'
import { format } from 'util'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let uniqueUsers = new Map()

  if (!global.conns || !Array.isArray(global.conns)) {
    global.conns = []
  }

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws?.socket?.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  let uptime = process.uptime() * 1000
  let formatUptime = clockString(uptime)

  let totalUsers = uniqueUsers.size

  let txt = `LISTA DE BOTS ACTIVOS`
  txt += `\n\n`
  txt += `OficialBot: 1\n`
  txt += `Prem-Bots: 0\n`
  txt += `Limite: 30\n`
  txt += `SubBots: ${totalUsers || 0}\n`

  if (totalUsers > 0) {
    txt += `\nSubbots - Números\n`
    let i = 1
    for (let jid of uniqueUsers.keys()) {
      txt += `  ${i++}. wa.me/${jid.split('@')[0]}\n`
    }
  }

  // Miniatura cuadrada pequeña
  let thumbBuffer = await fetch('https://qu.ax/JzyUy.jpg').then(res => res.buffer())

  // Enviar la imagen con caption y miniatura
  await conn.sendMessage(
    m.chat,
    {
      image: { url: 'https://qu.ax/JzyUy.jpg' },
      caption: txt.trim(),
      jpegThumbnail: thumbBuffer // miniatura cuadrada pequeña
    },
    { quoted: m }
  )
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}