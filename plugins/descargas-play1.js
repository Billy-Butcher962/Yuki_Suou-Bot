import yts from 'yts-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `\`\`\`[ 🌴 ] Por favor ingresa un texto. Ejemplo:\n${usedPrefix + command} Did I tell you that I miss you\`\`\``;

    try {
        const search = await yts(text);
        if (!search.all.length) throw 'No se encontraron resultados.';

        const isVideo = /vid$/.test(command);
        const { title, views, timestamp, ago, url, thumbnail } = search.all[0];
        const body = `\`\`\`⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜

        ≡ Título : » ${title}
        ≡ Views : » ${views}
        ≡ Duration : » ${timestamp}
        ≡ Uploaded : » ${ago}
        ≡ URL : » ${url}

# 🌴 Su ${isVideo ? 'Video' : 'Audio'} se está enviando, espere un momento...\`\`\``;

        conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: body 
        }, { quoted: m });

        let res = await dl_vid(url);
        let type = isVideo ? 'video' : 'audio';
        let mediaUrl = isVideo ? res.data.mp4 : res.data.mp3;

        conn.sendMessage(m.chat, { 
            [type]: { url: mediaUrl }, 
            gifPlayback: false, 
            mimetype: isVideo ? "video/mp4" : "audio/mpeg" 
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, `Error: ${error.message}`, { quoted: m });
    }
}

handler.command = ['play1', 'play2'];
handler.help = ['play1', 'play2'];
handler.tags = ['descargas'];
export default handler;

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
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error al procesar la descarga.');
    }
}
