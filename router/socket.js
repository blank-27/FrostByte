
module.exports = (io) =>{
    io.on('connection',socket=>{
        console.log('new connection',socket.id)

        socket.on('join-room',(userId,roomId,name)=>{
            socket.join(roomId);
            console.log(name)
            socket.to(roomId).broadcast.emit('user-connected',userId,name)

            
            socket.on('disconnect',()=>{
                socket.to(roomId).broadcast.emit('user-disconnected',userId);
            })

            socket.on('present',userId=>{
                socket.to(roomId).broadcast.emit('presenting',userId);
            })
        })

        
    })
}