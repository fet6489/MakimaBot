import { igdl } from "ruhend-scraper"

let handler = async (m, { args, conn }) => { 
if (!args[0]) {
return conn.reply(m.chat, '🩵 Ingresa un link de Instagram.', m, fake)}
try {
await m.react(rwait)
conn.reply(m.chat, `🩵 *Enviando El Video...*`, m, fake, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, 
thumbnail: icons,
sourceUrl: channel }}})      
let res = await igdl(args[0])
let data = res.data       
for (let media of data) {
await new Promise(resolve => setTimeout(resolve, 2000))           
await conn.sendFile(m.chat, media.url, 'instagram.mp4', '🩵 *Video de instagram.*\n' + textbot, m, fake)
}} catch {
await m.react(error)
conn.reply(m.chat, '🩵 Ocurrió un error.', m, fake)}}

handler.command = ['instagram', 'ig']
handler.tags = ['descargas']
handler.help = ['instagram', 'ig']
handler.cookies = 1
handler.register = true

export default handler