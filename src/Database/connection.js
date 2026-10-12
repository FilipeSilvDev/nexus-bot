const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('node:path');

async function openDb() {
    return open({
        filename: path.join(__dirname, 'nexodatabase.sqlite'),
        driver: sqlite3.Database,
    })
}
async function createDb() {
    const db = await openDb();
    await db.exec(
        `PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS guild_settings(
            guild_id TEXT PRIMARY KEY,
            news_channel_id TEXT,
            logs_channel_id TEXT,
            updated_at NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS rss_feeds(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            enabled INTEGER NOT NULL DEFAULT 1
                CHECK (enabled IN (0,1)),
            created_at NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS rss_news(
            id INTEGER PRIMARY KEY,
            feed_id INTEGER NOT NULL,
            item_key TEXT NOT NULL,
            title TEXT,
            url TEXT,
            published_at TEXT,
            fist_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            
            FOREIGN KEY (feed_id)
                REFERENCES rss_feeds(id)
                ON DELETE CASCADE,
            
            UNIQUE (feed_id, item_key)
        );`
    )
    return db;
}

module.exports = { openDb, createDb };