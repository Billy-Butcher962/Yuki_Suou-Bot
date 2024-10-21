import { fetchJson } from '@bochilteam/scraper';
import yts from 'yt-search'

let handler = async (m, { conn, args, text, command }) => {
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
    let data = await fetchJson(`https://api.bochilteam.workers.dev/ytmp3?url=${vid.url}`);
    let mimetype = 'audio/mpeg';
    let file = { url: data.result.url };

    await conn.sendMessage(m.chat, { audio: file, mimetype, fileName: `${data.result.title}.mp3` }, { quoted: m })
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
