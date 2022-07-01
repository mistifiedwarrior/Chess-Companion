import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  gameId: {type: String, trim: true, required: true, unique: true},
  chats: [{timestamp: {type: Date}, playerId: {type: String}, message: {type: String}}]
})

const ChatRepository = mongoose.model('Chat', chatSchema)
export default ChatRepository
