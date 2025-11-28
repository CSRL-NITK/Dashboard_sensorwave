const Transport = require('winston-transport');
const { poolforCommon } = require('../config/database');

class PostgresTransport extends Transport {
    constructor(opts) {
        super(opts);
    }

    async log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        const query = 'INSERT INTO all_logs (level, timestamp, message) VALUES ($1, NOW(), $2)';
        const values = [info.level, info.message];

        try {
            await poolforCommon.query(query, values);
        } catch (err) {
            console.error('Postgres Transport Error:', err);
        }

        callback();
    }
}

module.exports = PostgresTransport;
