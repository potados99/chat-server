export default class Client {
  username: string;
  socketId: string;
  enteredAt: number;
  remoteAddress: string;

  static create(props: Partial<Client>): Client {
    return Object.assign(new Client(), props);
  }

  serialize() {
    return {
      username: this.username,
      enteredAt: this.enteredAt,
    };
  }
}
