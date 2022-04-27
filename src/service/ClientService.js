const ClientService = {
  clients: [],
  
  addClient(client) {
    this.clients.push(client)
  },
  
  removeClient(playerId) {
    this.clients = this.clients.filter((client) => client.playerId !== playerId)
  }
}

export default ClientService
