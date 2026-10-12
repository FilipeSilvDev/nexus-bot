const { openDb } = require('../connection');

async function addFeed({ name, category, url }) {
    const db = await openDb();
    await db.run(
        `INSERT INTO rss_feeds (name, category, url)
             VALUES (?, ?, ?)`,
        [name, category, url]
    )
}

module.exports = {
    addFeed,
}