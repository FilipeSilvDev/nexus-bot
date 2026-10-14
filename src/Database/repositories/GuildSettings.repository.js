const { openDb } = require('../connection');
/**
 *
 * @param guildId - ID da guilda que será configurada
 * @param channelId - ID do canal referente a guilda configurada que será enviada as noticias
 * @returns {Promise<boolean>}
 */
async function setNewsChannel(guildId, channelId) {
    const db = await openDb();
    await db.run(
        `INSERT INTO guild_settings (guild_id, news_channel_id)
             VALUES (?, ?)
             ON CONFLICT (guild_id) DO UPDATE SET
                news_channel_id = excluded.news_channel_id,
                updated_at = CURRENT_TIMESTAMP`,
        [guildId, channelId]
    );
    return true;
}

/**
 *
 * @param guildId - ID da guilda que será configurada
 * @param channelId - ID do canal referente a guilda configurada que será enviada as noticias
 * @returns {Promise<boolean>}
 */
async function setLogsChannel(guildId, channelId) {
    const db = await openDb();
    await db.run(
        `INSERT INTO guild_settings (guild_id, logs_channel_id)
             VALUES (?, ?)
             ON CONFLICT (guild_id) DO UPDATE SET
                logs_channel_id = excluded.logs_channel_id,
                updated_at = CURRENT_TIMESTAMP`,
        [guildId, channelId]
    );
    return true;
}

module.exports = {
    setNewsChannel,
    setLogsChannel
}