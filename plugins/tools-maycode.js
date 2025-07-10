async function blackSessions({ pathSessions, m, conn, command }) {
  let codeMode = command === 'codepremium';

  let { version } = await fetchLatestBaileysVersion();
  const msgRetryCache = new NodeCache();
  const { state, saveState, saveCreds } = await useMultiFileAuthState(pathPremium);

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetry: () => {},
    msgRetryCache,
    browser: codeMode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Makima Premium', 'Chrome', '2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  };

  let sock = makeWASocket(connectionOptions);

  if (codeMode) {
    // pairing code: se debe hacer justo al abrir la conexión
    sock.ev.on('connection.update', async (update) => {
      const { connection, isNewLogin } = update;
      if (connection === 'open') {
        await conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]}, Te conectaste a Makima Premium con éxito.`, mentions: [m.sender] }, { quoted: m });
        global.conns.push(sock);
      }
      if (connection === 'connecting' && isNewLogin) {
        // Solicita pairing code apenas comience la conexión
        try {
          let secret = await sock.requestPairingCode((m.sender.split`@`[0]));
          secret = secret.match(/.{1,4}/g)?.join("-");
          let txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
          let codeBot = await m.reply(secret);
          if (txtCode && txtCode.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000);
          if (codeBot && codeBot.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000);
        } catch (e) {
          await conn.reply(m.chat, "Hubo un error generando el código premium, intenta nuevamente.", m);
        }
      }
    });
  } else {
    // modo QR tradicional
    sock.ev.on('connection.update', async (update) => {
      const { connection, isNewLogin, qr } = update;
      if (connection === 'open') {
        await conn.sendMessage(m.chat, { text: `@${m.sender.split('@')[0]}, Te conectaste a Makima Premium con éxito.`, mentions: [m.sender] }, { quoted: m });
        global.conns.push(sock);
      }
      if (qr) {
        let txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx }, { quoted: m });
        if (txtQR && txtQR.key) setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000);
      }
    });
  }

  setInterval(async () => {
    if (!sock.user) {
      try { sock.ws.close(); } catch (e) {}
      sock.ev.removeAllListeners();
      let i = global.conns.indexOf(sock);
      if (i < 0) return;
      delete global.conns[i];
      global.conns.splice(i, 1);
    }
  }, 60000);
}