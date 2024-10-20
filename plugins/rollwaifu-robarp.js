import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Función para obtener datos
const obtenerDatos = () => {
    return fs.existsSync('data.json') ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) : { 'usuarios': {}, 'personajesReservados': [] };
};

// Función para guardar datos
const guardarDatos = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Función para obtener personajes
const obtenerPersonajes = () => {
    return fs.existsSync('./src/JSON/characters.json') ? JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8')) : [];
};

// Función para etiquetar usuarios
const tagUser = (user) => '@' + user.split('@')[0];

// Función para formatear tiempo
const formatTime = (time) => {
    let minutes = Math.floor(time / 1000 % 60);
    let seconds = Math.floor(time / 1000 / 60 % 60);
    return minutes + ' minutos y ' + seconds + ' segundos';
};

// Handler principal
let handler = async (message, { conn }) => {
    let data = obtenerDatos();
    let personajes = obtenerPersonajes();
    let userId = message.mentionedJid && message.mentionedJid[0] ? message.mentionedJid[0] : message.quoted && message.quoted.mentionedJid ? message.quoted.mentionedJid : null;

    if (!userId) {
        conn.reply(message.from, '¡Debes mencionar a un usuario!', message);
        return;
    }

    // Verificación de datos
    let userData = data.usuarios[userId] || { 'characters': [], 'totalRwcoins': 0, 'lastRobTime': 0 };
    let currentTime = new Date().getTime();
    const coolDownTime = 3600000; // 1 hora en milisegundos

    if (currentTime - userData.lastRobTime < coolDownTime) {
        let waitTime = coolDownTime - (currentTime - userData.lastRobTime);
        let formattedWaitTime = formatTime(waitTime);
        conn.reply(message.from, `Debes esperar ${formattedWaitTime} antes de robar de nuevo.`, message);
        return;
    }

    // Lógica para robar personajes
    let availableCharacters = userData.characters;
    if (!availableCharacters.length) {
        conn.reply(message.from, `No tienes personajes disponibles para robar.`, message);
        return;
    }

    let randomIndex = Math.floor(Math.random() * availableCharacters.length);
    let stolenCharacter = availableCharacters[randomIndex];
    availableCharacters.splice(randomIndex, 1);
    
    userData.characters.push(stolenCharacter);
    userData.totalRwcoins += stolenCharacter.value; // Asumiendo que los personajes tienen un valor
    userData.lastRobTime = currentTime;

    data.usuarios[userId] = userData;
    guardarDatos(data);

    conn.sendMessage(message.from, {
        image: { url: stolenCharacter.url }, // Suponiendo que el objeto tiene una propiedad url
        caption: `¡Has robado a ${stolenCharacter.name}! Tienes ahora ${userData.totalRwcoins} RWcoins.`,
        mentions: [userId]
    });
};

handler.help = ['robar'];
handler.tags = ['economía'];
handler.command = ['robar'];
handler.group = true;

export default handler;