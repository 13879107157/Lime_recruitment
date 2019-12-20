const {ChatModel} = require('../db/models')
module.exports = function (server){
    const io = require('socket.io')(server)
    //监视客户端与服务器的连接
    io.on('connect',function(socket){
        console.log('有一个客户端连接到服务器');
        socket.on('sendMsg',function({from,to,content}){
            console.log('接收到客户端发送的消息',{from,to,content});
            //处理数据(保存消息)
            //准备chatMsg对象的相关数据
            const create_time = Date.now()
            const chat_id = [from,to].sort().join('_')
            new ChatModel({from,to,content,chat_id,create_time}).save(function(error,chatMsg){
                io.emit('receiveMsg',chatMsg)
            })
        })
    })
}
