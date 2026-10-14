
const MOJANG_API = "https://api.mojang.com";
const SKIN_API = "https://skinrender.dev";

async function requestJson(url) {
    const response = await fetch(url, {
        headers: {
            "User-Agent": "NEXO-Bot/1.0"
        },
        signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
        const error = new Error(`API retornou HTTP ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

function formatUUID(uuid) {
    return uuid.replace(
        /^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/i,
        "$1-$2-$3-$4-$5"
    );
}

async function getProfile(username) {
    if (!/^[a-zA-Z0-9_]{1,16}$/.test(username)) {
        throw new Error("INVALID_USERNAME");
    }

    // 1. Converte o nickname em UUID.
    const profile = await requestJson(
        `${MOJANG_API}/users/profiles/minecraft/${encodeURIComponent(username)}`
    );

    if (!profile.id || !profile.name) {
        throw new Error("PROFILE_NOT_FOUND");
    }

    const uuid = profile.id;
    const formattedUUID = formatUUID(uuid);

    // 2. Obtém os dados associados à skin.
    const skinData = await requestJson(
        `${SKIN_API}/api/profile/${uuid}`
    );

    return {
        username: profile.name,
        uuid,
        formattedUUID,
        skinUrl: skinData.skinUrl ?? null,

        avatarUrl:
            `${SKIN_API}/render/${uuid}/head?size=256`,

        bodyUrl:
            `${SKIN_API}/render/${uuid}/body?size=512`
    };
}

module.exports = getProfile;

