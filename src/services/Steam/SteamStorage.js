const { request } = require('undici');

async function SeachGameInStore(term) {
    const { body } = await request(`https://store.steampowered.com/api/storesearch/?term=${term}&l=brazilian&cc=br`);
    const resultSearch = await body.json();
    const firstGameList = resultSearch.items[0].id;

    const resultDetails = await SearchGameDetails(firstGameList)
    if (resultDetails === null) {
        return null;
    }

    const gameData = resultDetails[firstGameList].data;
    return gameData ? gameData : null;
}

async function SearchGameDetails(gameId) {
    const { body } = await request(`https://store.steampowered.com/api/appdetails?appids=${gameId}&l=brazilian&cc=br`);
    if (!body) {
        return null;
    } else {
        return body.json();
    }
}

module.exports = { SeachGameInStore, SearchGameDetails }