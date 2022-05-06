import express from 'express';
import {Server} from 'socket.io';
import * as http from 'http';
import ClientService from './ClientService';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

/** 이름 중복 검사 */
app.post('/validate/username', async (req, res) => {
  const {username} = req.body;

  try {
    ClientService.validateUsername(username);
    res.send();
  } catch (e: any) {
    res.status(409).send();
  }
});

io.on('connection', (socket) => {
  /** 입장 */
  socket.on('hello', ({sender}) => {
    ClientService.addNewClient(sender, socket)
      .then(() => {
        io.emit('notice', {body: `${sender} 님이 입장하셨습니다.`});
        io.emit('clients', ClientService.getAllClients());
      })
      .catch(console.error);
  });

  /** 퇴장 */
  socket.on('disconnect', () => {
    ClientService.removeClient(socket)
      .then((c) => {
        io.emit('notice', {body: `${c.username} 님이 나가셨습니다.`});
        io.emit('clients', ClientService.getAllClients());
      })
      .then(console.error);
  });

  /** 챗 */
  socket.on('chat', ({sender, body, sentAt}) => {
    io.emit('chat', {sender, body, sentAt});
  });
});

server.listen(process.env.PORT || 9999);
