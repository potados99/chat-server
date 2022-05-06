import Client from './Client';

class ClientRepository {
  private clients: Client[] = [];

  addClient(client: Client) {
    this.clients.push(client);
  }

  findClientBySocketId(socketId: string): Client | undefined {
    return this.clients.find((c) => c.socketId === socketId);
  }

  findClientByUsername(username: string): Client | undefined {
    return this.clients.find((c) => c.username === username);
  }

  getAllClients(): Client[] {
    return this.clients;
  }

  removeClient(socketId: string) {
    this.clients = this.clients.filter((c) => c.socketId !== socketId);
  }
}

export default new ClientRepository();
