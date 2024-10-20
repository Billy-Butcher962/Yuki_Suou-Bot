const cooldown = 604800000 * 4; // 4 semanas
const baseReward = 20000;

var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let timeRemaining = user.monthly + cooldown - new Date();

    if (timeRemaining > 0) {
        return m.reply(`⏱️ ¡Ya reclamaste tu regalo mensual! Vuelve en:\n *${msToTime(timeRemaining)}*`);
    }

    // Recompensas aleatorias
    let coinReward = pickRandom([5000, 10000, 15000, 20000, baseReward]);
    user.coin += coinReward;

    m.reply(`
\`\`\`🎁 ¿Ya ha pasado un mes? El tiempo se pasa volando. ¡Disfruta tu regalo mensual! 🐢\`\`\`

🪙 *YukiCoins* : +${coinReward.toLocaleString()}`);
    
    user.monthly = new Date * 1;
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
