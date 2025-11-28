const { createLogger, format, transports } = require('winston');
const PostgresTransport = require('./PostgresTransport');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
})

const developmentLogger = () => {
    return createLogger({
        level: 'info',
        format: combine(timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new PostgresTransport(),
        ],
    })
}

module.exports = developmentLogger; 