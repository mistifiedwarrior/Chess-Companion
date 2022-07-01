import {logOnError, logOnSuccess} from '../logger/logger.js'
import Games from '../domain/Games.js'
import ChatRepository from '../repository/ChatRepository.js'
import Chat from '../domain/Chat.js'

const ChatService = () => ({
  findChats(gameId) {
    return ChatRepository.findOne({gameId})
      .then((chat) => {
        if (!chat) {
          return this.save(new Chat(gameId))
            .then(Chat.load)
        }
        return Chat.load(chat)
      })
      .then(logOnSuccess('Successfully find chat', {gameId}))
      .catch(logOnError('', 'Failed to find chat', {gameId}))
  },

  save(chat) {
    return new ChatRepository(chat).save()
  },

  updateChat({game, message, playerId}) {
    return Games.getChat(game.gameId)
      .then((chat) => chat.addChat({message, playerId}))
      .then((chats) => ChatRepository.findOneAndUpdate({gameId: game.gameId}, {$set: chats})
        .then(() => chats))

  }
})

const chatService = ChatService()
export default chatService
