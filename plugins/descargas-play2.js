import fetch from 'node-fetch';
import axios from 'axios';

const handler = async (m, {conn, command, args, text, usedPrefix}) => {

    if (!text) throw `_*[ ⚠️ ] Agrega lo que quieres buscar*_\n\n_Ejemplo:_\n.play Marshmello Moving On`;

    try { 
        
        let { data } = await axios.get(`https://deliriussapi-oficial.vercel.app/search/spotify?q=${encodeURIComponent(text)}&limit=10`);

        if (!data.data || data.data.length === 0) {
            throw `_*[ ⚠️ ] No se encontraron resultados para "${text}" en Youtube.*_`;
        }

        const img = data.data[0].image;
        const url = data.data[0].url;
        const info = `⧁ 𝙏𝙄𝙏𝙐𝙇𝙊
» ${data.data[0].title}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝙋𝙐𝘽𝙇𝙄𝘾𝘼𝘿𝙊
» ${data.data[0].publish}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝗗𝗨𝗥𝗔𝗖𝗜𝗢𝗡
» ${data.data[0].duration}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁  𝙋𝙊𝙋𝙐𝙇𝘼𝙍𝙄𝘿𝘼𝘿
» ${data.data[0].popularity}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁  𝘼𝙍𝙏𝙄𝙎𝙏𝘼
» ${data.data[0].artist}
﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘﹘
⧁ 𝙐𝙍𝙇
» ${url}

_*🎶 Enviando música...*_`.trim();

        await conn.sendFile(m.chat, img, 'imagen.jpg', info, m);

        //＼／＼／＼／＼／＼／ DESCARGAR ＼／＼／＼／＼／＼／
    
        const apiUrl = `https://deliriussapi-oficial.vercel.app/download/spotifydl?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.data.url) {
            const downloadUrl = result.data.url;
            const filename = `${result.data.title || 'audio'}.mp3`;
            await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, fileName: filename, mimetype: 'audio/mpeg', caption: `╭━❰  *YouTube*  ❱━⬣\n${filename}\n╰━❰ *${wm}* ❱━⬣`, quoted: m });
        } else {
            throw new Error('_*[ ❌ ] Ocurrió un error al descargar el archivo mp3_');
        }

    } catch (e) {

        await conn.reply(m.chat, `❌ _*El comando #play está fallando, repórtalo al creador del bot*_`, m);

        console.log(`❌ El comando #play está fallando`);
        console.log(e);
    }
};

handler.help = ['play'] 
handler.tags = ['downloader']
handler.command = ['play'];
export default handler;
