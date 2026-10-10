const { request } = require("undici");
const dotenv = require("dotenv");
dotenv.config();


const SteamKey = process.env.STEAM_API_KEY;
const targetSteamID = "76561197972495328";

async function profileSteam(SteamKey, targetSteamID) {
    const { body } = await request(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamKey}&steamids=${targetSteamID}`);
    const data = await body.json();

    const players = [
        {
            "id": "123456",
            "realname": "Steam Player 1"
        }
    ]

    let tes = players.map((playerInfo) => {
        playerInfo
    });
    console.log(test)
}

profileSteam(SteamKey, targetSteamID)