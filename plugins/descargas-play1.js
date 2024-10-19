import fetch from 'node-fetch';
import yts from 'yt-search';
import { youtubedl } from '@bochilteam/scraper';

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) throw `_𝐄𝐬𝐜𝐫𝐢𝐛𝐞 𝐮𝐧𝐚 𝐩𝐞𝐭𝐢𝐜𝐢𝐨́𝐧 𝐥𝐮𝐞𝐠𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐣𝐞𝐦𝐩𝐥𝐨:_ \n*${usedPrefix + command} Billie Eilish - Bellyache*`;

    try {
        const yt_play = await search(args.join(' '));
        if (!yt_play.length) throw 'No se encontraron resultados.';

        const videoUrl = yt_play[0].url;
        const texto1 = `
╭ׅׄ̇─͓̗̗─ׅ̄╮
┟─⬪𝕐𝕦𝕜𝕚_𝕊𝕦𝕠𝕦⬪╮
│
├ ⚘ 𝕋í𝕥𝕦𝕝𝕠: ${yt_play[0].title}
├ ⚘ ℙ𝕦𝕓𝕝𝕚𝕔𝕒𝕕𝕠: ${yt_play[0].ago}
├ ⚘ 𝔻𝕦𝕣𝕒𝕔𝕚ó𝕟: ${secondString(yt_play[0].duration.seconds)}
├ ⚘ 𝕍𝕚𝕤𝕥𝕒𝕤: ${MilesNumber(yt_play[0].views)}
├ ⚘ 𝔸𝕦𝕥𝕠𝕣(𝕒): ${yt_play[0].author.name}
├ ⚘ 𝔼𝕟𝕝𝕒𝕔𝕖: ${videoUrl}
╰ׁ̻─۟─۪─۟─۪﹅
        `.trim();

        await conn.sendButton(m.chat, wm, texto1, yt_play[0].thumbnail, [
            ['𝕄𝔼ℕ𝕌 ✨', `${usedPrefix}menu`],
            ['🌟 𝔸𝕌𝔻𝕀𝕆', `${usedPrefix}play5 ${videoUrl}`],
            ['🌟 𝕍𝕀𝔻𝔼𝕆', `${usedPrefix}play6 ${videoUrl}`]
        ], null, null, fgif2);

        const media = await dl_vid(videoUrl);
        const type = media.type === 'video' ? 'video' : 'audio';

        conn.sendMessage(m.chat, {
            [type]: { url: media.url },
            gifPlayback: false,
            mimetype: media.type === 'video' ? 'video/mp4' : 'audio/mpeg'
        }, { quoted: m });

    } catch (e) {
        await conn.reply(m.chat, `*[ ! ] ʜᴜʙᴏ ᴜɴ ᴇʀʀᴏʀ ᴇɴ ᴇʟ ᴄᴏᴍᴀɴᴅᴏ ᴘᴏʀ ғᴀᴠᴏʀ ɪɴᴛᴇɴᴛᴀ ᴍᴀs ᴛᴀʀᴅᴇ..*`, fkontak, m, rcanal);
        console.error(`❗❗ᴇʀʀᴏʀ ${usedPrefix + command} ❗❗`, e);
    }
};

handler.command = ['play', 'play2', 'play3', 'play4'];
handler.register = true;
handler.group = true;
export default handler;

async function search(query, options = {}) {
    const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
    return search.videos;
}

async function dl_vid(url) {
    try {
        const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'api_key': 'free',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: url })
        });

        if (!response.ok) {
            throw new Error(`Error al descargar el video. Estado HTTP: ${response.status}`);
        }

        const data = await response.json();
        return { url: data.url, type: data.type }; // Asegúrate de que la respuesta tenga estas propiedades
    } catch (error) {
        console.error(error);
        throw new Error('Error al procesar la descarga.');
    }
}

function MilesNumber(number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    const arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
    const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
