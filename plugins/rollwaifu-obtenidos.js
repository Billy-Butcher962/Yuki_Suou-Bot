import fs from 'fs';
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Función para obtener datos desde un archivo JSON
const obtenerDatos = () => {
    return fs.existsSync('data.json') 
        ? JSON.parse(fs.readFileSync('data.json', 'utf-8')) 
        : { 'usuarios': {}, 'personajesReservados': [] };
};

// Función para obtener personajes desde un archivo JSON
const obtenerPersonajes = () => {
    return fs.existsSync('./src/JSON/characters.json') 
        ? JSON.parse(fs.readFileSync('./src/JSON/characters.json', 'utf-8')) 
        : [];
};

// Función para contar el total de personajes
const contarTotalPersonajes = () => {
    if (fs.existsSync('./src/JSON/characters.json')) {
        const data = fs.readFileSync('./src/JSON/characters.json', 'utf-8').split('\n');
        return data.length - 2; // Restar 2 por posibles líneas vacías
    } 
    return 0;
};

// Manejador de comandos
let handler = async (context, { conn, usedPrefix }) => {
    const senderId = context.sender;
    let datos = obtenerDatos();
    let personajes = obtenerPersonajes();
    let totalPersonajes = contarTotalPersonajes();

    // Verificar si el usuario tiene personajes reservados
    if (!datos.usuarios || !(senderId in datos.usuarios) || datos.usuarios[senderId].characters.length === 0) {
        conn.reply(context.sender, '*No tienes ningún objeto en tu inventario 😹🫵!*', context);
        return;
    }

    // Validar la integridad de los datos de package.json
    const validarPackage = () => {
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

    if (!validarPackage()) {
        await conn.reply(context.sender, 'Este comando solo está disponible para Megumin Bot.\n🔥 https://github.com/David-Chian/Megumin-Bot-MD', context);
        return;
    }

    const { characters, totalRwcoins } = datos.usuarios[senderId];
    const cantidadPersonajes = characters.length;

    // Obtener personajes no reservados
    let personajesReservados = new Set();
    Object.values(datos.usuarios).forEach(usuario => {
        usuario.characters.forEach(personaje => {
            personajesReservados.add(personaje.name);
        });
    });

    let personajesDisponibles = personajes.filter(personaje => !personajesReservados.has(personaje.name));
    let cantidadDisponibles = personajesDisponibles.length;

    // Generar respuesta
    const mensaje = `Tus Personajes:\n\nTotal de Personajes: ${cantidadPersonajes}\nTotal de RWCoins: ${totalRwcoins}\nPersonajes Disponibles: ${cantidadDisponibles}/${totalPersonajes}`;
    
    const botones = personajesDisponibles.map((personaje, index) => ({
        header: personaje.name,
        title: `Personaje ${index + 1}`,
        description: `Descripción: ${personaje.name}`,
        id: usedPrefix + 'personaje_' + personaje.name
    }));

    const device = await getDevice(context.sender.id);
    
    // Enviar mensaje dependiendo del tipo de dispositivo
    if (device !== 'desktop' && device !== 'web') {
        const interactiveMessage = {
            body: { text: mensaje },
            footer: { text: 'Personajes Obtenidos' },
            nativeFlowMessage: {
                buttons: [{
                    name: 'Selecciona para ver la imagen',
                    buttonParamsJson: JSON.stringify({
                        title: 'Lista de Personajes',
                        sections: [{
                            title: 'Selecciona un personaje',
                            rows: botones
                        }]
                    })
                }],
                messageParamsJson: ''
            }
        };

        let waMessage = generateWAMessageFromContent(context.sender, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: context });
        conn.relayMessage(context.sender, waMessage.message, { messageId: waMessage.key.id });
    } else {
        conn.reply(context.sender, mensaje, context);
    }
};

// Metadatos del manejador
handler.help = ['personajes'];
handler.tags = ['commands'];
handler.command = ['personajes', 'ob'];
handler.register = true;

export default handler;