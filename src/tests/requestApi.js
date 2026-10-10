const { request } = require("undici");
const dotenv = require("dotenv");
dotenv.config();

const SteamKey = process.env.STEAM_API_KEY;
const targetSteamID = "76561197972495328";


async function SeachGameInStore(term) {
    const { body } = await request(`https://store.steampowered.com/api/storesearch/?term=${term}&l=brazilian&cc=br`);
    const resultSearch = await body.json();
    const firstGameList = resultSearch.items[0].id;

    const resultDetails = await SearchGameDetails(firstGameList)
    if (resultDetails === null) {
        return null;
    }

    const gameData = resultDetails[firstGameList].data;
    console.log(gameData);
}

async function SearchGameDetails(gameId) {
    const { body } = await request(`https://store.steampowered.com/api/appdetails?appids=${gameId}&l=brazilian&cc=br`);
    if (!body) {
        return null;
    } else {
        return body.json();
    }
}

SeachGameInStore("call of duty")