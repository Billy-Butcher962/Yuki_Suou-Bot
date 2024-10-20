import fs from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Función para obtener datos desde un archivo JSON
const obtenerDatos = () => {
    if (fs.existsSync('data.json')) {
        return JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    } else {
        return { usuarios: {}, personajesReservados: [] };
    }
};

// Función para guardar datos en un archivo JSON
const guardarDatos = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Función para obtener personajes desde un archivo
const obtenerPersonajes = () => {
    if (fs.existsSync('./src/JSON/characters.json')) {
        return JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8'));
    } else {
        throw new Error('No se encontró el archivo de personajes.');
    }
};

// Manejador de comandos
let darrwHandler = async (context, { conn, args }) => {
    if (args.length < 2) {
        conn.reply(context.sender, 'Uso incorrecto. Por favor, menciona un usuario y un personaje.', context);
        return;
    }

    const username = args[0];
    const characterName = args.slice(1).join(' ').trim();

    // Validaciones de datos
    const datos = obtenerDatos();
    const personajesReservados = datos.usuarios[username];

    if (!personajesReservados || personajesReservados.length === 0) {
        conn.reply(context.sender, 'No tienes personajes en tu inventario.', context);
        return;
    }

    const personajeIndex = personajesReservados.findIndex(p => p.name.toLowerCase() === characterName.toLowerCase());

    if (personajeIndex === -1) {
        conn.reply(context.sender, `El personaje ${characterName} no está reservado por ti.`, context);
        return;
    }

    // Obtener información del personaje
    const personajes = obtenerPersonajes();
    const personaje = personajes.find(p => p.name.toLowerCase() === characterName.toLowerCase());

    if (!personaje) {
        conn.reply(context.sender, `No se encontró el personaje ${characterName} en la base de datos.`, context);
        return;
    }

    // Proceso de reserva
    const usuarioData = datos.usuarios[username] || { characterCount: 0, totalRwcoins: 0, characters: [] };
    usuarioData.characters.push({ name: personaje.name, url: personaje.url, value: personaje.value });
    usuarioData.characterCount++;
    datos.usuarios[username] = usuarioData;

    // Actualizar personajes reservados
    personajesReservados.splice(personajeIndex, 1);
    datos.totalRwcoins -= personaje.value;

    guardarDatos(datos);

    // Respuesta al usuario
    conn.sendMessage(context.sender, {
        image: { url: personaje.url },
        caption: `Has reservado a ${personaje.name}.`
    }, { quoted: context });
};

// Exportar el manejador
darrwHandler.help = ['darrw'];
darrwHandler.tags = ['commands'];
darrwHandler.register = true;

export default darrwHandler;