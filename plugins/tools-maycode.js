/* Codigo hecho por SoyMaycol
---> GitHub: SoySapo6 */

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

const rtx = "︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT PREMIUM\n\n━⧽ MODO CODIGO QR PREMIUM\n\n✰ Pasos de vinculación:\n\n• Escanea este QR en WhatsApp Web.\n• Disfruta de tu SubBot premium.";
const rtx2 = "︰꯭𞋭🩵 ̸̷᮫໊᷐͢᷍ᰍ⧽͓̽ CONEXIÓN SUBBOT PREMIUM\n\n━⧽ MODO CODIGO PREMIUM\n\n✰ Pasos de vinculación:\n\n• Pega este código en WhatsApp Web.\n• Disfruta de tu SubBot premium.";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!['codepremium', 'qrpremium'].includes(command)) return;

// Agregar esto después de la línea: let handler = await import('./handler.js')

// Hacer el handler accesible globalmente para los SubBots
global.handler = handler;

// En la función reloadHandler, también actualizar el global
global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) {
            handler = Handler;
            global.handler = Handler; // Actualizar también el global
        }
    } catch (e) {
        console.error(e);
    }
    
    // ... resto del código de reloadHandler
}

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

    // Vinculación premium
    let who = m.sender;
    let id = `${who.split('@')[0]}`;
    let pathPremium = path.join("./premiumSessions/", id);
    
    // Crear directorio si no existe
    if (!fs.existsSync(pathPremium)) {
        fs.mkdirSync(pathPremium, { recursive: true });
    }

    // Verificar que el directorio se creó correctamente
    if (!fs.existsSync(pathPremium)) {
        return conn.reply(m.chat, "Error: No se pudo crear el directorio de sesiones", m);
    }

    blackPremium({ pathPremium, m, conn, command, token });

    global.db.data.users[m.sender].Subs = new Date * 1;
};

handler.help = ['qrpremium <TOKEN>', 'codepremium <TOKEN>'];
handler.tags = ['premium'];
handler.command = ['qrpremium', 'codepremium'];
export default handler;

async function blackPremium({ pathPremium, m, conn, command, token }) {
    let codeMode = command === 'codepremium';

    try {
        let { version } = await fetchLatestBaileysVersion();
        const msgRetryCache = new NodeCache();
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathPremium);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { 
                creds: state.creds, 
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) 
            },
            msgRetry: () => {},
            msgRetryCache,
            browser: codeMode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Makima Premium', 'Chrome', '2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true,
            getMessage: async (clave) => {
                let jid = jidNormalizedUser(clave.remoteJid)
                let msg = await store.loadMessage(jid, clave.id)
                return msg?.message || ""
            },
        };

        let sock = makeWASocket(connectionOptions);
        
        // Configurar el SubBot como un bot completo
        sock.isInit = false;
        sock.well = false;
        
        // Asignar el handler del bot principal al SubBot
        if (global.handler && global.handler.handler) {
            sock.handler = global.handler.handler.bind(sock);
        }
        
        // Manejar eventos de credenciales
        sock.ev.on('creds.update', saveCreds);
        
        // Manejar eventos de mensajes (ESTO ES LO QUE FALTABA)
        sock.ev.on('messages.upsert', async (chatUpdate) => {
            if (sock.handler) {
                await sock.handler(chatUpdate);
            }
        });
        
        sock.ev.on('connection.update', async (update) => {
            const { connection, isNewLogin, qr, lastDisconnect } = update;
            
            if (connection === 'open') {
                sock.isInit = true;
                sock.well = true;
                
                await conn.sendMessage(m.chat, { 
                    text: `@${m.sender.split('@')[0]}, Te conectaste a Makima Premium con éxito.`, 
                    mentions: [m.sender] 
                }, { quoted: m });
                
                // Inicializar conns si no existe
                if (!global.conns) global.conns = [];
                global.conns.push(sock);
                
                // Configurar datos del usuario del SubBot
                if (global.db && global.db.data) {
                    if (!global.db.data.users[sock.user.id]) {
                        global.db.data.users[sock.user.id] = {
                            exp: 0,
                            limit: 50,
                            lastclaim: 0,
                            registered: true,
                            regTime: +new Date,
                            age: -1,
                            name: sock.user.name || 'SubBot Premium'
                        };
                    }
                }
                
                console.log('SubBot Premium conectado exitosamente');
            }
            
            if (qr && !codeMode) {
                try {
                    let txtQR = await conn.sendMessage(m.chat, { 
                        image: await qrcode.toBuffer(qr, { scale: 8 }), 
                        caption: rtx 
                    }, { quoted: m });
                    
                    if (txtQR && txtQR.key) {
                        setTimeout(() => { 
                            conn.sendMessage(m.chat, { delete: txtQR.key }).catch(() => {});
                        }, 30000);
                    }
                } catch (error) {
                    console.error('Error generando QR:', error);
                }
            }
            
            if (qr && codeMode) {
                try {
                    let secret = await sock.requestPairingCode(`${m.sender.split('@')[0]}`);
                    secret = secret.match(/.{1,4}/g)?.join("-");
                    
                    let txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
                    let codeBot = await m.reply(secret);
                    
                    if (txtCode && txtCode.key) {
                        setTimeout(() => { 
                            conn.sendMessage(m.chat, { delete: txtCode.key }).catch(() => {});
                        }, 30000);
                    }
                    if (codeBot && codeBot.key) {
                        setTimeout(() => { 
                            conn.sendMessage(m.chat, { delete: codeBot.key }).catch(() => {});
                        }, 30000);
                    }
                } catch (error) {
                    console.error('Error generando código:', error);
                }
            }

            // Manejar desconexiones
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
                console.log('Conexión cerrada debido a ', lastDisconnect?.error, ', reconectando ', shouldReconnect);
                
                if (shouldReconnect) {
                    // Intentar reconectar después de un delay
                    setTimeout(() => {
                        blackPremium({ pathPremium, m, conn, command, token });
                    }, 5000);
                } else {
                    // Limpiar token si hay error de autenticación
                    if (global.usedPremiumTokens[token]) {
                        delete global.usedPremiumTokens[token];
                    }
                    // Limpiar directorio de sesión
                    if (fs.existsSync(pathPremium)) {
                        fs.rmSync(pathPremium, { recursive: true, force: true });
                    }
                }
            }
        });

        // Cleanup interval mejorado
        const cleanupInterval = setInterval(async () => {
            if (!sock.user) {
                try { 
                    sock.ws.close(); 
                } catch (e) {
                    console.error('Error cerrando websocket:', e);
                }
                
                sock.ev.removeAllListeners();
                
                if (global.conns) {
                    let i = global.conns.indexOf(sock);
                    if (i >= 0) {
                        delete global.conns[i];
                        global.conns.splice(i, 1);
                    }
                }
                
                clearInterval(cleanupInterval);
            }
        }, 60000);

    } catch (error) {
        console.error('Error en blackPremium:', error);
        await conn.reply(m.chat, `Error al inicializar el SubBot: ${error.message}`, m);
        
        // Limpiar token en caso de error
        if (global.usedPremiumTokens[token]) {
            delete global.usedPremiumTokens[token];
        }
    }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60);
    
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    
    return minutes + ' m y ' + seconds + ' s ';
}