import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketIO, activeGames, activeTicTacToeGames } from './socket';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'GestPlay Backend Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/games/active', (req, res) => {
  const games: any[] = [];
  
  for (const roomId in activeGames) {
    const game = activeGames[roomId];
    games.push({
      roomId,
      gameType: 'chess',
      status: 'active',
      playerCount: (game.players.white ? 1 : 0) + (game.players.black ? 1 : 0)
    });
  }

  for (const roomId in activeTicTacToeGames) {
    const game = activeTicTacToeGames[roomId];
    games.push({
      roomId,
      gameType: 'tictactoe',
      status: game.status,
      playerCount: (game.players.X ? 1 : 0) + (game.players.O ? 1 : 0)
    });
  }

  res.json({ success: true, games });
});

setupSocketIO(io);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`GestPlay Backend is listening on port ${PORT}`);
});
