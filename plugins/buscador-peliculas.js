import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    // Usar un idioma por defecto si no está definido
    const idioma = global.db.data.users[m.sender]?.language || 'es'; // 'es' como idioma por defecto
    let _translate = {};

    // Intentar cargar el archivo de idioma correspondiente
    try {
      _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
    } catch {
      _translate = JSON.parse(fs.readFileSync('./src/languages/es.json')); // Cargar español como idioma por defecto
    }

    const tradutor = _translate.plugins.buscador_peliculas;

    if (!text) throw `*${tradutor.texto1}*`;

    const results = await searchC(text);
    if (results.length === 0) throw `*${tradutor.texto2}*`;

    const randomIndex = Math.floor(Math.random() * results.length);
    const selectedResult = results[randomIndex];
    const img = selectedResult.image ? `https://wwv.cuevana8.com${selectedResult.image}` : 'https://www.poresto.net/u/fotografias/m/2023/7/5/f1280x720-305066_436741_5050.png';

    const res = results.map(v => 
      `*${tradutor.texto3[0]}* ${v.title}\n*${tradutor.texto3[1]}* ${v.link}`
    ).join('\n\n─────────────────\n\n');

    const ads = `*${tradutor.texto3[2]}* ${tradutor.texto3[3]}\n*${tradutor.texto3[4]}* https://block-this.com/block-this-latest.apk\n\n≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣≣\n\n`;

    conn.sendMessage(m.chat, { image: { url: img }, caption: ads + res }, { quoted: m });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return conn.sendMessage(m.chat, { text: '*[❗] Error, no se obtuvieron resultados.' }, { quoted: m });
  }
};

handler.command = ['cuevana', 'pelisplus'];
export default handler;

async function searchC(query) {
  try {
    const response = await axios.get(`https://wwv.cuevana8.com/search?q=${query}`);
    const $ = cheerio.load(response.data);
    const resultSearch = [];

    $('.MovieList .TPostMv').each((_, e) => {
      const element = $(e);
      const title = element.find('.Title').first().text();
      const link = element.find('a').attr('href');
      const image = element.find('img').attr('src');
      resultSearch.push({ title, link, image });
    });

    return resultSearch;
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return [];
  }
}
