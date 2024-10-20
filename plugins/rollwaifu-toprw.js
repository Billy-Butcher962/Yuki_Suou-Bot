import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const obtenerDatos = () => {
    return fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
};

let toprwHandler = async (message, { conn }) => {
    let data = obtenerDatos();
    let usuarios = Object.entries(data.usuarios);

    if (usuarios.length === 0) {
        conn.reply(message.chat, 'No hay datos de usuarios disponibles.', message);
        return;
    }

    const checkPackage = () => {
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

    if (!checkPackage()) {
        await conn.reply(message.chat, 'Error de verificación del bot. Por favor, verifica la configuración.', message);
        return;
    }

    let topCharacters = usuarios
        .sort(([_, userA], [_, userB]) => userB.characterCount - userA.characterCount)
        .slice(0, 10)
        .map(([userId, userData]) => ({
            id: userId,
            nombre: '@' + userId.split('@')[0],
            personajes: userData.characterCount
        }));

    let topRwCoins = usuarios
        .sort(([_, userA], [_, userB]) => userB.totalRwcoins - userA.totalRwcoins)
        .slice(0, 10)
        .map(([userId, userData]) => ({
            id: userId,
            nombre: '@' + userId.split('@')[0],
            rwcoins: userData.totalRwcoins
        }));

    let responseMessage = '🌟*Top 10 Usuarios con Más Personajes*🌟\n\n';
    topCharacters.forEach((user, index) => {
        responseMessage += `${index + 1}. ${user.nombre} - ${user.personajes} personajes\n`;
    });
    responseMessage += '\n💰*Top 10 Usuarios con Más RWCoins*💰\n\n';
    topRwCoins.forEach((user, index) => {
        responseMessage += `${index + 1}. ${user.nombre} - ${user.rwcoins} RWCoins\n`;
    });

    await conn.sendMessage(message.chat, {
        text: responseMessage,
        mentions: [...topCharacters.map(user => user.id), ...topRwCoins.map(user => user.id)]
    });
};

toprwHandler.help = ['toprw'];
toprwHandler.tags = ['ranking'];
toprwHandler.command = ['toprw'];
toprwHandler.group = true;

export default toprwHandler;