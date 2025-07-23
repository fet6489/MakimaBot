import ws from 'ws';

let handler = async (m, { conn, usedPrefix, args }) => {
  if (!args[0] && (!m.mentionedJid || m.mentionedJid.length === 0))
    return m.reply(`⚠️ Etiqueta o escribe el número de algún sub-bot\nEjemplo: ${usedPrefix}setprimary @tag`);

  const subBots = global.conns.filter(c => 
    c?.user?.jid && 
    c?.ws?.socket && 
    c.ws.socket.readyState !== ws.CLOSED
  );

  if (!subBots.length) 
    return m.reply('⚠️ No hay sub-bots activos.');

  let botJid = '';
  let selectedBot = null;

  if (m.mentionedJid && m.mentionedJid.length > 0) {
    botJid = m.mentionedJid[0];
    selectedBot = subBots.find(c => c.user.jid === botJid);
  } else {

    let num = args[0].replace(/[^0-9]/g, '');
    botJid = num + '@s.whatsapp.net';
    selectedBot = subBots.find(c => c.user.jid === botJid);
  }

  if (!selectedBot)
    return m.reply("⚠️ No se encontró un sub-bot conectado con esa mención o número. Usa /listjadibot para ver los disponibles.");

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};

  global.db.data.chats[m.chat].primaryBot = botJid;
  m.reply(`✅ El sub-bot @${botJid.split('@')[0]} ha sido establecido como primario en este grupo. Los demás sub-bots no responderán aquí.`, false, { mentions: [botJid] });
};

handler.help = ['setprimary <@tag|número>'];
handler.tags = ['jadibot'];
handler.command = ['setprimary'];
handler.group = true;
handler.register = true;

export default handler;