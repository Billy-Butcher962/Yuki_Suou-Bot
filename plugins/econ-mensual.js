const DEFAULT_REWARD = 20000; // Recompensa mensual por defecto
const DEFAULT_COOLDOWN = 604800000 * 4; // Tiempo de enfriamiento por defecto (4 semanas)

let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    // Verifica si ya ha reclamado la recompensa mensual
    if (new Date() - user.monthly < DEFAULT_COOLDOWN) {
        throw `⏱️ ¡Ya reclamaste tu regalo mensual! Vuelve en:\n *${msToTime((user.monthly + DEFAULT_COOLDOWN) - new Date())}*`;
    }

    // Actualiza la cantidad de monedas
    user.coin += DEFAULT_REWARD;

    // Respuesta al usuario
    conn.reply(m.chat, `
\`\`\`🎁 ¡Es hora de tu regalo mensual! 🐢\`\`\`

🪙 *${mssg.money}* : +${DEFAULT_REWARD.toLocaleString()}`, m);

    // Actualiza la fecha del último reclamo
    user.monthly = new Date() * 1;
};

handler.help = ['monthly'];
handler.tags = ['econ'];
handler.command = ['mensual', 'monthly'];

export default handler;

function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 365);
    
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    days = (days > 0) ? days : 0;

    return days + ` ${mssg.day} ` + hours + ` ${mssg.hour} ` + minutes + ` ${mssg.minute}`;
}
