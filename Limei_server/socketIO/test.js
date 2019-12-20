module.exports = function (server){
    const io = require('socket.io')(server)
    //监视客户端与服务器的连接
    io.on('connect',function(socket){
        console.log('有一个客户端连接到服务器');

        socket.on('sendMsg',function(data){
            console.log('服务器接收到客户端发送的消息',data);
            data.name = data.name.toUpperCase()
            socket.emit('receiveMsg',data)
            console.log('服务器向客户端发送消息',data);
        })
    })
}
