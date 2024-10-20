import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

let cooldowns = {};

const obtenerDatos = () => {
    return fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
};

const guardarDatos = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

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

let handler = async (message, { conn }) => {
    if (!message.quoted) return;

    if (!verificar()) {
        await conn.reply(message.chat, 'Error de verificación del bot. Por favor, verifica la configuración.', message);
        return;
    }

    let senderId = message.sender;
    let senderName = await conn.getName(senderId);
    let quotedId = message.quoted.sender.match(/<id:(.*)>/)?.[1];
    let data = obtenerDatos();

    if (!quotedId) return;

    let reservedCharacter = data.personajesReservados.find(reserved => reserved.id === quotedId);
    let currentTime = new Date().getTime();
    const cooldownTime = 10 * 60 * 1000; // 10 minutos
    let lastCooldown = cooldowns[senderId] || 0;

    if (currentTime - lastCooldown < cooldownTime) {
        let remainingTime = cooldownTime - (currentTime - lastCooldown);
        let minutes = Math.floor(remainingTime / 60000);
        let seconds = Math.floor((remainingTime % 60000) / 1000);
        await conn.reply(message.chat, `Debes esperar ${minutes} minutos y ${seconds} segundos antes de volver a usar este comando.`, message);
        return;
    }

    if (!reservedCharacter) {
        await conn.reply(message.chat, `¡Lo siento, este personaje no está disponible en este momento!`, message);
        return;
    }

    let characterUrl = reservedCharacter.url;
    let userId = reservedCharacter.userId;

    // Verifica si el personaje ya ha sido robado por el usuario
    let userData = data.usuarios[senderId];
    if (userData && userData.characters && userData.characters.some(character => character.url === characterUrl)) {
        await conn.reply(message.chat, `¡El personaje ${reservedCharacter.name} ya ha sido robado por @${userId.split('@')[0]}!`, message, { mentions: [senderId] });
        return;
    }

    // Proceso para robar el personaje
    let character = {
        name: reservedCharacter.name,
        url: reservedCharacter.url,
        value: reservedCharacter.value
    };

    if (!data.usuarios[senderId]) {
        data.usuarios[senderId] = {
            characters: [],
            characterCount: 0,
            totalRwcoins: 0
        };
    }

    // Agrega el personaje a los personajes del usuario
    data.usuarios[senderId].characters.push(character);
    data.usuarios[senderId].characterCount++;
    data.usuarios[senderId].totalRwcoins += character.value;

    // Elimina el personaje de los reservados
    data.personajesReservados = data.personajesReservados.filter(reserved => reserved.id !== quotedId);

    guardarDatos(data);
    cooldowns[senderId] = currentTime;

    let characterName = await conn.getName(userId);
    await conn.reply(message.chat, `¡Felicidades @${senderId.split('@')[0]}, has robado a ${character.name}!`, message, { mentions: [senderId, userId] });
};

handler.help = ['c', 'robar'];
handler.tags = ['command'];
handler.command = ['c', 'robar'];
handler.group = true;

export default handler;