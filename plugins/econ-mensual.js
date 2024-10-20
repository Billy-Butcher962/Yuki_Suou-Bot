const cooldown = 604800000 * 4; // 4 semanas
const baseCoinReward = 20000;

var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let timeRemaining = user.monthly + cooldown - new Date();

    if (timeRemaining > 0) {
        return m.reply(`⏱️ ¡Ya reclamaste tu regalo mensual! Vuelve en:\n *${msToTime(timeRemaining)}*`);
    }

    // Recompensas aleatorias
    let coinReward = pickRandom([5000, 10000, 15000, 20000, baseCoinReward]);
    let cookieReward = pickRandom([1, 2, 3, 4, 5]); // Cantidad de cookies
    let expReward = pickRandom([500, 1000, 1500, 2000, 2500]); // Recompensa de experiencia

    // Actualizar los valores del usuario
    user.coin += coinReward;
    user.cookies = (user.cookies || 0) + cookieReward; // Añadir cookies
    user.exp = (user.exp || 0) + expReward; // Añadir experiencia

    m.reply(`
\`\`\`🎁 ¡Ha pasado un mes! ¡Disfruta de tu regalo mensual! 🐢\`\`\`

🪙 *YukiCoins* : +${coinReward.toLocaleString()}
🍪 *Cookies* : +${cookieReward}
✨ *Experiencia* : +${expReward}`);

    user.monthly = new Date * 1; // Actualizar la fecha de reclamación
}

handler.help = ['monthly'];
handler.tags = ['econ'];
handler.command = ['mensual', 'monthly'];

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

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

    return `${days} días ${hours} horas ${minutes} minutos`;
}
