const cheerio = require('cheerio');

async function RemoveHtml(text) {
    const $ = cheerio.load(text);
    return $.text().trim();
}

module.exports = { RemoveHtml };