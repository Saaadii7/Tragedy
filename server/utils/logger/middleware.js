const morgan = require('morgan');
const LoggerStreamAdapter = require('./streamer');

module.exports = ({ logger }) => {
    return morgan('dev', {
        stream: LoggerStreamAdapter.toStream(logger)
    });
};
