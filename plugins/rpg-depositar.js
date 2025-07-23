import db from '../lib/database.js'

let handler = async (m, { args }) => {
let user = global.db.data.users[m.sender]
if (!args[0]) return m.reply('🩵 Ingresa la cantidad de *Diamantes* que quieres Depositar.')
if ((args[0]) < 1) return m.reply('🩵 Ingresa una cantidad válida de *Diamantes*.')
if (args[0] == 'all') {
let count = parseInt(user.chocolates)
user.chocolates -= count * 1
user.bank += count * 1
await m.reply(`Depositaste *${count} Diamantes* al Banco.`)
return !0
}
if (!Number(args[0])) return m.reply('🩵 La cantidad deve ser un Numero.')
let count = parseInt(args[0])
if (!user.chocolates) return m.reply('No tienes *Diamantes* en la Cartera.')
if (user.chocolates < count) return m.reply(`Solo tienes *${user.chocolates} Diamantes* en la Cartera.`)
user.chocolates -= count * 1
user.bank += count * 1
await m.reply(`Depositaste *${count} Diamantes* al Banco.`)}

handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'dep', 'aguardar']
handler.register = true
export default handler 
