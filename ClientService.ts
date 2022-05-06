import Client from './Client';
import {Socket} from 'socket.io';
import ClientRepository from './ClientRepository';

class ClientService {
  validateUsername(username: string) {
    const existingClient = ClientRepository.findClientByUsername(username);

    if (existingClient != null) {
      throw new Error(`${username}은(는) 이미 다른 사람이 사용하고 있는 이름입니다.`);
    }
  }

  async addNewClient(username: string, socket: Socket) {
    this.validateUsername(username);

    ClientRepository.addClient(
      Client.create({
        username: username,
        socketId: socket.id,
        enteredAt: Date.now(),
        remoteAddress: socket.conn.remoteAddress,
      })
    );
  }

  getAllClients() {
    return ClientRepository.getAllClients().map((c) => c.serialize());
  }

  async removeClient(socket: Socket): Promise<Client> {
    const client = ClientRepository.findClientBySocketId(socket.id);

    if (client == null) {
      throw new Error(`socket.id가 ${socket.id}인 클라이언트가 없습니다.`);
    }

    ClientRepository.removeClient(socket.id);

    return client;
  }
}

export default new ClientService();
