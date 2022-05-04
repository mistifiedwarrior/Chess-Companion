const ClientService = {
  clients: [],
  
  addClient(client) {
    this.clients.push(client)
  },
  
  removeClient(playerId) {
    const clients = this.clients.filter((client) => client.playerId === playerId)
    console.log(clients.length, 'removable clients', playerId)
    this.clients = this.clients.filter((client) => client.playerId !== playerId)
  }
}

export default ClientService
