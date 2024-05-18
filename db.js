const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'subscriptions.db');

const db = new sqlite3.Database(dbPath);

db.migrate = () => {
    const migrationScripts = [
        './migrations/001_create_subscriptions_table.js'
    ];

    migrationScripts.forEach(script => {
        const migration = require(script);
        migration.up(db);
    });
};

module.exports = db;
