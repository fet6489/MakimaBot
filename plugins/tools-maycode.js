import moment from 'moment-timezone'

const comandosPermitidos = [
  '#menu', '#daily', '#on', '#off', '#enamble', '#disable',
  '#help', '#ia', '#bot', '#dalle2', '#pin', '#menú'
];

export async function before(m, { conn }) {
    // Si no está activado el autolevelup en el chat, salir
    let chat = global.db.data.chats[m.chat];
    if (!chat?.autolevelup) return !0;

    // Solo si el mensaje es uno de los comandos permitidos EXACTOS
    let texto = (m.text || '').toLowerCase().trim();
    if (!comandosPermitidos.includes(texto)) return !0;

    let user = global.db.data.users[m.sender];
    user.commandCount = user.commandCount || 0;
    user.commandCount++;

    let nombre = (typeof conn.getName === "function" ? await conn.getName(m.sender) : user.name) || m.pushName || m.sender.split('@')[0];
    let mensaje = `💎 F E L I C I D A D E S 💎\n\n¡Hola! ${nombre} Alcanzaste un nuevo nivel por usar el comando:\n\n「 ${m.text} 」\n\n💎 Sigue interactuando con Makima para ganar más niveles.`;
    let imagenURL = 'https://qu.ax/wJhGR.jpg';
    await conn.sendMessage(m.chat, {
        image: { url: imagenURL },
        caption: mensaje,
        mentions: [m.sender]
    }, { quoted: m });

    return !0;
}