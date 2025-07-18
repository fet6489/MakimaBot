import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' ; 
import { tr, translateText } from './lib/_checkLang.js';

//---------[ Añada los numeros a ser Propietario/a ]---------

global.owner = [['18293142989', 'ＰＲＯＰＩＥＴＡＲＩＯ', true], ['18293142989'], ['18293142989'], ['18293142989'], ['5217411126626'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989'], ['18293142989']]
global.mods = []
global.prems = []

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
global.botNumberCode = "" //Ejemplo: +59309090909
global.confirmCode = "" 
global.gataJadibts = true //cambia a false Desactivar en "auto-reconexion" de sub-bots

//Cambiar a tu idioma "es = español" - "en = inglés"
global.lang = "es"
global.tr = tr

//---------[ APIS GLOBAL ]---------

global.baileys = '@whiskeysockets/baileys'
global.apis = 'https://delirius-apiofc.vercel.app'

global.APIs = { lolhuman: { url: 'https://api.lolhuman.xyz/api/', key: 'GataDiosV3' },
skizo: { url: 'https://skizo.tech/api/', key: 'GataDios' },
alyachan: { url: 'https://api.alyachan.dev/api/', key: null }, 
neoxr: { url: 'https://api.neoxr.eu/api', key: 'GataDios' },
fgmods: { url: 'https://api.fgmods.xyz/api', key: 'elrebelde21' },
popcat: { url: 'https://api.popcat.xyz', key: null }}

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

//------------------------[ Stickers ]-----------------------------

global.packname = '𝐌𝐚𝐤𝐢𝐦𝐚'
global.author = '𝐅𝐞𝐥𝐢𝐱 𝐌𝐚𝐧𝐮𝐞𝐥'

//------------[ Versión | Nombre | cuentas ]------------

global.wm = '𝗠𝗮𝗸𝗶𝗺𝗮 𝗕𝗼𝘁 𝗠𝗗' 
global.vs = '1.9.8'
global.yt = 'https://www.youtube.com/frasesbebor@gmail.com'
global.tiktok = 'https://www.tiktok.com/Feli'
global.md = 'https://github.com/mantis-has/Makima'
global.fb = 'https://www.facebook.com/akinoaynadaqueteimporte'
global.face = 'https://www.facebook.com/groups/872989990425710/'

global.nna = 'https://whatsapp.com/channel/0029Vb6FW3S2Jl8GHcoBTB0w' //Update
global.nna2 = 'https://whatsapp.com/channel/0029Vb6FW3S2Jl8GHcoBTB0w' //update
global.nnaa = 'https://whatsapp.com/channel/0029Vb6Gkkr72WU3oxtrx81o' //Test
global.nn = 'https://chat.whatsapp.com/GZdFpo11kIQ54pa1lgUiQ9?mode=r_c' //Grupo 1
global.nnn = 'https://chat.whatsapp.com/K0DIkrutOQI6If1kdZ4l9D?mode=r_c' //Grupo de denji
global.nnnt = 'https://chat.whatsapp.com/BVDsynSLZd43wqu8cXnLsU?mode=r_c' //Grupo del Colaboracion
global.nnntt = 'https://chat.whatsapp.com/HpQ5moxR8NOJSZmF0FngeD?mode=r_c' //Socializar
global.nnnttt = 'https://chat.whatsapp.com/KoJjHo6o3Ew7P5qkjaIh0r?mode=r_c' //A.T.T.M
global.nnntttt = 'https://chat.whatsapp.com/E9pDOR55DHE9vQE9KXZk3P?mode=r_c' //Grupo ayuda sobre el bot
global.bot = 'wa.me/18293142989'
global.redes = [nna, nna2, yt, nn, nnn, nnnt, nnntt, nnnttt, nnntttt, md, tiktok, fb, face]

//------------------------[ Info | Datos ]---------------------------

global.wait = 'Estoy procesando. Porfavor no agas spam.'
global.waitt = '*⌛ _Cargando..._ ▬▬▭▭▭*'
global.waittt = '*⌛ _Cargando..._ ▬▬▬▬▭▭*'
global.waitttt = '*⌛ _Cargando..._ ▬▬▬▬▬▬▭*'
global.waittttt = '*⌛ _Cargando..._ ▬▬▬▬▬▬▬*'
global.rg = '『 Resultados 』\n\n'
global.ag = '『 Advertencia 』\n\n'
global.iig = '『 Información 』\n\n'
global.fg = '『 Error 』\n\n'
global.mg = '『 Formato incorrecto 』\n\n'
global.eeg = '『 Reporte 』\n\n'
global.eg = '『 Éxito 』\n\n'

//-------------------------[ IMAGEN ]------------------------------
//global.img = "https://qu.ax/caXVr.jpg"
global.img1 = 'https://qu.ax/iQNpS.jpg'
global.img2 = 'https://qu.ax/gYzBQ.jpg'

global.imagen = fs.readFileSync('./Menu2.jpg')
global.imagen1 = fs.readFileSync('./media/Menu1.jpg')
global.imagen2 = fs.readFileSync('./media/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/Menu3.jpg')
global.imagen4 = fs.readFileSync('./media/Menu4.jpg')
global.imagen5 = 'https://qu.ax/caXVr.jpg'
global.imagen6 = 'https://qu.ax/iQNpS.jpg'
global.menu18 = 'https://qu.ax/gYzBQ.jpg'
global.vid1 = 'https://qu.ax/gYzBQ.jpg'
global.img = [imagen, imagen1, imagen2, imagen3, imagen4]
global.imageUrl = ["https://qu.ax/gYzBQ.jpg", "https://qu.ax/iQNpS.jpg", "https://qu.ax/caXVr.jpg"]

//----------------------------[ NIVELES | RPG ]---------------------------------

global.multiplier = 850 // Cuanto más alto, más difícil subir de nivel
global.maxwarn = '4' // máxima advertencias

//---------------[ IDs de canales ]----------------

global.ch = {
ch1: '120363420059734524@newsletter', 
ch2: '120363402078116190@newsletter',
ch3: '120363422990331018@newsletter',
}

//----------------------------------------------------

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
