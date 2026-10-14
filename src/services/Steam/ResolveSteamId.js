const STEAM_API_KEY = process.env.STEAM_API_KEY;

async function resolveSteamId(input) {
    const value = input.trim();

    // Aceita SteamId64
    if (/^\d{17}$/.test(value)) {
        return value;
    }

    // Aceita Vanity URl ou nome personalizado.
    let vanityUrl = value;

    if (/^https?:\/\//i.test(value)) {
        const url = new URL(value);

        if (
            url.hostname !== "steamcommunity.com" &&
            url.hostname !== "www.steamcommunity.com"
        ) {
            throw new Error("URL_INVALID"); // URL da Steam inválida
        }

        const match = url.pathname.match(/^\/id\/([^/]+)\/?$/);
        if (!match) {
            throw new Error("PROFILE_FORMAT_INVALID"); // Formato de perfil não suportado
        }

        vanityUrl = match[1];
    } else {
        vanityUrl = value.replace(/^\/+|\/+$/g, "");
    }

    if (!vanityUrl) {
        throw new Error("VANITY_INVALID"); // Identificador Inválida.
    }
    if (!STEAM_API_KEY) {
        throw new Error("API_KEY_INVALID"); // Configuração da API Inválida.
    }

    const endpoint = new URL("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/");
    endpoint.searchParams.set("key", STEAM_API_KEY);
    endpoint.searchParams.set('vanityurl', vanityUrl);

    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error("STEAM_NOT_QUERY"); // Não foi possível consultar a Steam
    }

    const data = await response.json();
    const result = data.response;

    if(result.success !== 1 || !result.steamid) {
        throw new Error("PROFILE_NOT_FOUND"); // Perfil Steam não encontrado
    }

    return result.steamid;
}

module.exports = resolveSteamId;