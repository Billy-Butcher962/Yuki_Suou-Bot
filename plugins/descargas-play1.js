import fetch from 'node-fetch';
import axios from 'axios';

// ... otras importaciones

const handler = async (m, {conn, command, args, text, usedPrefix}) => {
    if (!text) throw `_𝐄𝐬𝐜𝐫𝐢𝐛𝐞 𝐮𝐧𝐚 𝐩𝐞𝐭𝐢𝐜𝐢𝐨́𝐧 𝐥𝐮𝐞𝐠𝐨 𝐝𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐣𝐞𝐦𝐩𝐥𝐨:_ \n*${usedPrefix + command} Billie Eilish - Bellyache*`;
    try {
        // Llama a la nueva API
        const apiKey = 'tn5mcinnb88ni5ybmkb2qr'; // Asegúrate de mantener tu API key segura
        const response = await axios.get(`https://api.eliasar.cloud/api/ytplay?text=${encodeURIComponent(args.join(' '))}&apikey=${apiKey}`);
        
        const yt_play = response.data; // Asegúrate de que la estructura de respuesta sea correcta
        const texto1 = `
╭ׅׄ̇─͓̗̗─ׅ̻ׄ╮۪̇߭⊹߭̇︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇⊹۪̇߭︹ׅ̟ׄ̇︹ׅ۪ׄ̇߭︹ׅ̟ׄ̇߭︹ׅ۪ׄ̇߭̇⊹
┟─⬪࣪ꥈ𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪𝔻𝔼𝕊ℂ𝔸ℝ𝔾𝔸𝕊໑⃪࣭۪ٜ݊݊݊݊𑁍ꥈ࣪⬪╮
╭┄─🍂⬪࣪ꥈ𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪𝕐𝕦𝕜𝕚_𝕊𝕦𝕠𝕦໑⃪࣭۪ٜ݊݊݊݊𑁍ꥈ࣪⬪╯
│
├ ⚘݄𖠵⃕⁖𖥔. _*𝕋í𝕥𝕦𝕝𝕠*_
├» ${yt_play.title}
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┄
├ ⚘݄𖠵⃕⁖𖥔. _*ℙ𝕦𝕓𝕝𝕚𝕔𝕒𝕕𝕠*_
├» ${yt_play.ago}
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌┈
├ ⚘݄𖠵⃕⁖𖥔. _*𝔻𝕦𝕣𝕒𝕔𝕚ó𝕟*_
├» ${secondString(yt_play.duration.seconds)}
├╌╌╌╌╌╌╌╌╌╌╌╌┄
├ ⚘݄𖠵⃕⁖𖥔. _*𝕍𝕚𝕤𝕥𝕒𝕤*_
├» ${MilesNumber(yt_play.views)}
├╌╌╌╌╌╌╌╌╌╌┄
├ ⚘݄𖠵⃕⁖𖥔. _*𝔸𝕦𝕥𝕠𝕣(𝕒)*_
├» ${yt_play.author.name}
├╌╌╌╌╌╌╌╌┈
├ ⚘݄𖠵⃕⁖𖥔. _*𝔼𝕟𝕝𝕒𝕔𝕖*_
├» ${yt_play.url}
╰ׁ̻۫─۪۬─۟─۪─۫─۪۬─۟─۪─۟─۪۬─۟─۪─۟─۪۬─۟─۪─۟┄۪۬┄۟┄۪┈۟┈۪`.trim();

        await conn.sendButton(m.chat, wm, texto1, yt_play.thumbnail, [['𝕄𝔼ℕ𝕌 ✨', `${usedPrefix}menu`],['🌟 𝔸𝕌𝔻𝕀𝕆',`${usedPrefix}play5 ${yt_play.url}`],['🌟 𝕍𝕀𝔻𝔼𝕆',`${usedPrefix}play6 ${yt_play.url}`]], null, null, fgif2);
    } catch (e) {
        await conn.reply(m.chat, `*[ ! ] ʜᴜʙᴏ ᴜɴ ᴇʀʀᴏʀ ᴇɴ ᴇʟ ᴄᴏᴍᴀɴᴅᴏ ᴘᴏʀ ғᴀᴠᴏʀ ɪɴᴛᴇɴᴛᴀ ᴍᴀs ᴛᴀʀᴅᴇ..*`, fkontak, m, rcanal);
        console.log(`❗❗ᴇʀʀᴏʀ ${usedPrefix + command} ❗❗`);
        console.log(e);
        handler.limit = 0;
    }
};

// ... resto del código sin cambios

export default handler;
