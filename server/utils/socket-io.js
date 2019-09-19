module.exports = ({ server, app }) => {
    const io = require('socket.io')(server);
    app.set('io', io);
    process.io = io;
    return io;
};
