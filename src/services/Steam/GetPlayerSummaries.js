const { request } = require('undici');

/*
 * STEAM API: GetLayerSummarieApi - Busca de Perfil
 *
 * Função utilizada para retornar informações básicas do perfil via url da steam
 * @param {string} SteamKey - Chave da API da Steam.
 * @param {string} SteamId - SteamID da conta que será pequisada
*/
async function GetLayerSummarieApi(SteamKey, SteamId) {
    const { body } = await request(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamKey}&steamids=${SteamId}`);
    const data = await body.json();
    return data.response.players[0];
}

module.exports = GetLayerSummarieApi;