class Chat {
  gameId
  chats

  constructor(gameId, chats = []) {
    this.gameId = gameId
    this.chats = chats
  }

  static load(chats) {
    return new Chat(chats.gameId, chats.chats)
  }

  async addChat({message = '', playerId}) {
    if (message.trim()) {
      this.chats.push({timestamp: new Date(), message: message.trim(), playerId})
    }
    return this
  }
}

export default Chat
