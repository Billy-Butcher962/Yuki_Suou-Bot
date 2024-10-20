const DEFAULT_REWARD = 20000; // Recompensa por defecto
const DEFAULT_COOLDOWN = 604800000 * 4; // Tiempo de enfriamiento por defecto (4 semanas)

let handler = async (m, { conn, reward = DEFAULT_REWARD, cooldown = DEFAULT_COOLDOWN }) => {
    let user = global.db.data.users[m.sender];

    if (new Date() - user.monthly < cooldown) {
        throw `⏱️ ¡Ya reclamaste tu regalo mensual! Vuelve en:\n *${msToTime((user.monthly + cooldown) - new Date())}*`;
    }

    user.coin += reward; // Añadir recompensa al usuario
    m.reply(`
\`\`\`🎁 ¡Es hora de tu regalo mensual! 🐢\`\`\`

🪙 *${mssg.money}* : +${reward.toLocaleString()}`);
    user.monthly = new Date() * 1; // Actualizar la fecha del último reclamo
};

handler.help = ['monthly'];
handler.tags = ['econ'];
handler.command = ['mensual', 'monthly'];

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
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
