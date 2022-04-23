import app from './app.js'

const port = process.env.PORT || 3001
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/chess'

/*
 * connect(dbUrl)
 *   .then(() => )
 *   .catch(() => console.log('Failed to connect with db'))
 */

app.listen(port, () => console.log('server start on port', port))
