// Código creado por los del canal de Códigos uwu
import { performance } from 'perf_hooks';

const handler = async (m, { conn, text, participants }) => {
  const start = performance.now();
  const end = performance.now();
  const executionTime = (end - start);

  let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  let phoneNumber = target.split('@')[0];

  async function loading() {
    const steps = [
      "⚡ Iniciando conexión segura con el servidor...",
      "🔍 Escaneando puertos abiertos...",
      "📡 Handshake completado con dirección IP 192.168.25.93",
      "📂 Extrayendo metadatos del dispositivo...",
      `⏳ Progreso: ${getRandomInt(5, 15)}%`,
      `⏳ Progreso: ${getRandomInt(20, 35)}%`,
      "🔑 Obteniendo claves de autenticación...",
      `⏳ Progreso: ${getRandomInt(40, 55)}%`,
      "💾 Descargando registros del sistema...",
      `⏳ Progreso: ${getRandomInt(60, 75)}%`,
      "🛡 Eliminando rastros digitales...",
      `⏳ Progreso: ${getRandomInt(80, 95)}%`,
      "✅ HACKING COMPLETED",
      "📡 Generando reporte final..."
    ];

    let { key } = await conn.sendMessage(
      m.chat,
      { text: `*☠ Iniciando proceso de doxxing...*` },
      { quoted: m }
    );

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, getRandomInt(700, 2000)));
      await conn.sendMessage(m.chat, { text: steps[i], edit: key }, { quoted: m });
    }
    let nombre = await conn.getName(target);

    const fakeReport = `
*\`☠ HACKED DATA ☠\`*
👤 Nombre detectado: ${nombre}
📱 Teléfono vinculado: +${phoneNumber}
🌐 Dirección IP: 192.168.${getRandomInt(1,255)}.${getRandomInt(1,255)}
🛰 Ubicación aproximada: ${getRandomInt(1,255)}.${getRandomInt(1,255)}.${getRandomInt(1,255)}.${getRandomInt(1,255)} (GeoIP)

\`📧 Emails filtrados:\`
- ${randomString(6)}@gmail.com
- ${randomString(6)}@yahoo.com
- ${randomString(6)}@proton.me

\`🔑 Contraseñas expuestas:\`
- ${randomString(10)}
- ${randomString(10)}
- ${randomString(10)}

\`🍪 Cookies de sesión:\`
- session_${randomString(12)}
- auth_${randomString(12)}
- token_${randomString(12)}

\`📜 Historial de navegación:\`
- facebook.com/${randomString(6)}
- instagram.com/${randomString(6)}
- tiktok.com/@${randomString(6)}
- youtube.com/watch?v=${randomString(11)}

\`🖥 Logs del sistema:\`
[${new Date().toISOString()}] WARNING: Root access detected
[${new Date().toISOString()}] ERROR: Unauthorized login bypass
[${new Date().toISOString()}] INFO: Malware signature "trojan.fake" injected

⚠️ Datos transmitidos al servidor remoto con éxito.
`;

    await conn.sendMessage(m.chat, { text: fakeReport }, { quoted: m });
  }

  loading();
};

handler.help = ['doxear <@tag>'];
handler.tags = ['fun'];
handler.command = ['doxxing', 'doxear'];
handler.group = true;
handler.register = true;

export default handler;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}