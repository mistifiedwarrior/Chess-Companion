import app from './app.js'
import connect from './db/connect.js'
import websocket from './websocket.js'

const port = process.env.PORT || 3001
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/chess'

connect(dbUrl)
  .then(() => {
    const server = app.listen(port, () => console.log('server start on port', port))
    
    server.on('upgrade', websocket.onUpgrade)
  })
  .catch(() => console.log('Failed to connect with db'))
