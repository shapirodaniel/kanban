module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    /*
      enter-room emitted client-side
      client will send { type, id }
      where type: 'project', 'org', etc.
      and id: instance id, ex, /projects/2 <-

      socket should join the corresponding room
      ex, {type: 'project', id: 2} -> socket.join('project-2')
    */

    socket.on('enter-room', ({type, id}) => {
      console.log(`${socket.id} has entered the room!`)
      socket.join(`${type}-${id}`)
    })

    socket.on('leave-room', ({type, id}) => {
      console.log(`${socket.id} has left the room!`)
      socket.leave(`${type}-${id}`)
    })

    socket.on('UPDATE_CURRENT_PROJECT', ({type, id}) => {
      console.log('serverside update current project msg received!')
      io.to(`${type}-${id}`).emit('should-update')
    })

    socket.on('REORDER_TASK', ({type, id}) => {
      console.log('serverside update current project msg received!')
      io.to(`${type}-${id}`).emit('should-update')
    })
  })
}
