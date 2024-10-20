import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const obtenerDatos = () => {
    return fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
};

const obtenerPersonajes = () => {
    return fs.existsSync('./src/JSON/characters.json') ? JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8')) : [];
};

const handler = async (message, { conn, text }) => {
    if (!text) {
        conn.reply(message.chat, 'Por favor, proporciona el nombre del personaje que deseas ver.', message);
        return;
    }

    const verificar = () => {
        try {
            const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
            if (packageData.name !== 'Megumin-Bot-MD') return false;
            if (packageData.repository.url !== 'git+https://github.com/David-Chian/Megumin-Bot-MD.git') return false;
            if (SECRET_KEY !== '49rof384foerAlkkO4KF4Tdfoflw') return false;
            return true;
        } catch (error) {
            console.error('Error al leer package.json:', error);
            return false;
        }
    };

    if (!verificar()) {
        await conn.reply(message.chat, 'Error de verificación del bot. Por favor, verifica la configuración.', message);
        return;
    }

    const userId = message.sender;
    const characterName = text.trim().toLowerCase();
    const data = obtenerDatos();
    const personajes = obtenerPersonajes();

    // Verificar si el usuario tiene personajes
    if (!data.usuarios[userId] || !data.usuarios[userId].characters.some(character => character.name.toLowerCase() === characterName)) {
        conn.reply(message.chat, 'No tienes el personaje ' + characterName + ' en tu inventario.', message);
        return;
    }

    const character = data.usuarios[userId].characters.find(character => character.name.toLowerCase() === characterName);
    if (!character) {
        conn.reply(message.chat, 'No se encontró el personaje ' + characterName + '.', message);
        return;
    }

    const responseMessage = `*Este es tu personaje: ${character.name}*\nSu valor es: ${character.value} RWCoins.`;
    await conn.sendMessage(message.chat, {
        image: { url: character.url },
        caption: responseMessage,
        mimetype: 'image/jpeg'
    });
};

handler.help = ['verpersonaje'];
handler.tags = ['personajes'];
handler.command = ['verpersonaje'];
handler.group = true;

export default handler;