const socketIO = require('socket.io')

const initSocket = (server) => {
  console.log('🔧 Setting up Socket.io...') // Log 1
  
  try {
    const io = socketIO(server, {
      cors: { 
        origin: "*",
        methods: ["GET", "POST"]
      }
    })
    
    console.log('✅ Socket.io ready!') // Log 2

    io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id)
      
      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id)
      })
    })

    return io
  } catch (error) {
    console.error('❌ Socket.io setup failed:', error)
    throw error
  }
}

module.exports = initSocket