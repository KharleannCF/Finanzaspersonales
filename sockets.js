module.exports = function(server, sessionMiddleware) {
    let io = require('socket.io')(server);
    let db = require('./dataconnect');

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    })

    io.sockets.on('connection', (socket) => {
        io.emit('new query', socket.request.session.query)
    })
}