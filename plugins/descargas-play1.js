import Starlights from '@StarlightsTeam/Scraper'
import yts from 'yt-search'

let handler = async (m, { conn, text, command }) => {
  await m.react('🕓')
  let res = await yts(text)
  let vid = res.videos[0]
  let txt = '`乂 Y O U T U B E - P L A Y`\n\n'
      txt += `	✩   *Título*: ${vid.title}\n`
      txt += `	✩   *Duración*: ${vid.timestamp}\n`
      txt += `	✩   *Visitas*: ${formatNumber(vid.views)}\n`
      txt += `	✩   *Autor*: ${vid.author.name}\n`
      txt += `	✩   *Publicado*: ${eYear(vid.ago)}\n`
      txt += `	✩   *Url*: https://youtu.be/${vid.videoId}\n\n`
      txt += `> *- ↻ El archivo se está enviando, espera un momento, soy lenta. . .*`

  await conn.sendFile(m.chat, vid.thumbnail, 'thumbnail.jpg', txt, m)

  try {
    let data = await Starlights.ytmp3v2(vid.url) // Puedes cambiar a ytmp4v2 si prefieres video
    let mimetype = 'audio/mpeg'
    let file = { url: data.dl_url }

    await conn.sendMessage(m.chat, { audio: file, mimetype, fileName: `${data.title}.mp3` }, { quoted: m })
    await m.react('✅')
  } catch {
    await m.react('✖️')
  }
}

handler.help = ['play <búsqueda>']
handler.tags = ['downloader']
handler.command = ['ytplay', 'play']

export default handler

function eYear(txt) {
    if (!txt) {
        return '×'
    }
    // Simplificación de la función para mayor claridad
    let timeUnits = {
        "month": "mes",
        "year": "año",
        "hour": "hora",
        "minute": "minuto",
        "day": "dia"
    };
    for (let unit in timeUnits) {
        if (txt.includes(unit)) {
            let quantity = txt.replace(`${unit}${txt.includes('ago') ? ' ago' : ''}`, "").trim();
            return `hace ${quantity} ${timeUnits[unit]}${quantity > 1 ? 's' : ''}`;
        }
    }
    return txt;
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
