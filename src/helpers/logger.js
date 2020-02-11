const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const path = require('path');

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__basedir, 'tmp', 'log', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__basedir, 'tmp', 'log', 'default.log') })
  ]
});

module.exports = logger;
