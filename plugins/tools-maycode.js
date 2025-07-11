import { canLevelUp, xpRange } from '../lib/levelling.js'
import { levelup } from '../lib/canvas.js'
import moment from 'moment-timezone'

export function before(m, { conn, command }) {
    // Si no está activado el autolevelup en el chat, salir
    let chat = global.db.data.chats[m.chat]
    if (!chat.autolevelup) return !0

    let user = global.db.data.users[m.sender]
    user.commandCount = user.commandCount || 0
    user.commandCount++

    let beforeLevel = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++

    // Cada 5 veces que use un comando, se activa
    if (user.commandCount % 5 === 0) {
        let nombre = (typeof conn.getName === "function" ? conn.getName(m.sender) : user.name) || m.pushName || m.sender.split('@')[0]
        let fecha = moment.tz('America/Bogota').format('DD/MM/YY')
        let mensaje = `💎 F E L I C I D A D E S 💎\n\n¡Hola! ${nombre} Alcanzaste un nuevo nivel por usar el comando:\n\n「 ${m.text} 」\n\n💎 Sigue interactuando con Makima para ganar más niveles.`
        let imagenURL = 'https://qu.ax/wJhGR.jpg'
        conn.sendMessage(m.chat, {
            image: { url: imagenURL },
            caption: mensaje,
            mentions: [m.sender]
        }, { quoted: m })
    }

    // Si sube de nivel, pero no es el trigger de las 5 veces, sigue mostrando el mensaje clásico de levelup
    if (beforeLevel !== user.level && user.commandCount % 5 !== 0) {
        let nombre = (typeof conn.getName === "function" ? conn.getName(m.sender) : user.name) || m.pushName || m.sender.split('@')[0]
        m.reply(`💎 F E L I C I D A D E S 💎\n\noye ${nombre} Alcanzaste un nuevo nivel por usar a Makima\n\n💫 Nivel Actual » *${user.level}*\n🌵 Rango » *${user.role}*\n📆 Fecha » *${moment.tz('America/Bogota').format('DD/MM/YY')}*\n\n> *\`Interactúa más con la bot para ganar más niveles.\`*`)
    }
}