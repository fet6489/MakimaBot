import hispamemes from 'hispamemes'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // Si no ponen número se manda 1 meme (máximo 100)
    let cantidad = parseInt(args[0]) || 1
    if (cantidad > 100) cantidad = 100
    if (cantidad < 1) cantidad = 1

    m.reply(`🎭 Buscando ${cantidad} meme${cantidad > 1 ? 's' : ''} para ti...`)
    
    let memesEnviados = []
    let intentos = 0
    let maxIntentos = cantidad * 3

    for (let i = 0; i < cantidad && intentos < maxIntentos; i++) {
      intentos++
      let memeData = null

      // API 1: hispamemes
      try {
        let meme = hispamemes.meme()
        if (meme && !memesEnviados.includes(meme)) {
          memeData = { url: meme, title: 'Meme', author: 'Hispamemes' }
        }
      } catch (e) {}

      // API 2: meme-api.herokuapp.com
      if (!memeData) {
        try {
          let res = await fetch('https://meme-api.herokuapp.com/gimme')
          let data = await res.json()
          if (data.url && !memesEnviados.includes(data.url)) {
            memeData = {
              url: data.url,
              title: data.title || 'Meme',
              author: data.author || 'Desconocido'
            }
          }
        } catch (e) {}
      }

      // API 3: some-random-api.ml
      if (!memeData) {
        try {
          let res = await fetch('https://some-random-api.ml/meme')
          let data = await res.json()
          if (data.image && !memesEnviados.includes(data.image)) {
            memeData = { url: data.image, title: data.caption || 'Meme', author: 'Random' }
          }
        } catch (e) {}
      }

      // Si ninguna API funcionó usar memes locales
      if (!memeData) {
        const memesLocales = [
          'https://i.imgur.com/2vM8fNZ.jpg',
          'https://i.imgur.com/3kF9sNx.jpg',
          'https://i.imgur.com/7Gf2nKm.jpg',
          'https://i.imgur.com/9Hn3vQs.jpg'
        ]
        let randomMeme = memesLocales[Math.floor(Math.random() * memesLocales.length)]
        if (!memesEnviados.includes(randomMeme)) {
          memeData = { url: randomMeme, title: 'Meme Local', author: 'Colección' }
        }
      }

      if (memeData && !memesEnviados.includes(memeData.url)) {
        memesEnviados.push(memeData.url)
        let caption = `🎭 *MEME ${i + 1}/${cantidad}*\n\n`
        caption += `📝 *Título:* ${memeData.title}\n`
        caption += `👤 *Autor:* ${memeData.author}`
        await conn.sendFile(m.chat, memeData.url, 'meme.jpg', caption, m)
        if (i < cantidad - 1) await new Promise(r => setTimeout(r, 1000))
      } else {
        i--
      }
    }

    if (memesEnviados.length === 0) {
      m.reply('❌ No se pudieron obtener memes ahora, inténtalo más tarde.')
    } else if (memesEnviados.length < cantidad) {
      m.reply(`✅ Se enviaron ${memesEnviados.length} memes de ${cantidad} solicitados.`)
    }

  } catch (error) {
    console.error('Error en comando memes:', error)
    m.reply('❌ Ocurrió un error al obtener los memes.')
  }
}

handler.help = ['memes', 'meme']
handler.tags = ['fun']
handler.command = /^(memes?|meme)$/i
handler.limit = true
handler.group = true
handler.register = true

export default handler