import mongoose from 'mongoose'

const connect = (dbUrl) => mongoose.connect(dbUrl)

export default connect
