// Código creado por Félix para Sistema de Makima
// No quites créditos

import ws from 'ws'
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

  let totalUsers = uniqueUsers.size

  let txt = `LISTA DE BOTS ACTIVOS\n\n`
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

  // Datos para contexto newsletter
  const dev = 'Félix Manuel'
  const redes = 'https://github.com/Andresv27728/2.0'
  const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - UPDATES" }
  // Miniatura superior (perfil cuadrado pequeño)
  let perfil = 'https://files.catbox.moe/mqtxvp.jpg' // Puedes cambiar por la que gustes
  // Banner principal (imagen grande)
  let banner = 'https://qu.ax/JzyUy.jpg' // Puedes cambiar por cualquier otra

  await conn.sendMessage(m.chat, {
    image: { url: banner },
    caption: txt.trim(),
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        newsletterName: channelRD.name,
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: 'Makima Bot' MD',
        body: dev,
        thumbnailUrl: perfil,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: false,
      },
    }
  }, { quoted: m })
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler