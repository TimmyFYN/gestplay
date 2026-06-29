"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./socket");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'GestPlay Backend Running' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.get('/api/games/active', (req, res) => {
    const games = [];
    for (const roomId in socket_1.activeGames) {
        const game = socket_1.activeGames[roomId];
        games.push({
            roomId,
            gameType: 'chess',
            status: 'active',
            playerCount: (game.players.white ? 1 : 0) + (game.players.black ? 1 : 0)
        });
    }
    for (const roomId in socket_1.activeTicTacToeGames) {
        const game = socket_1.activeTicTacToeGames[roomId];
        games.push({
            roomId,
            gameType: 'tictactoe',
            status: game.status,
            playerCount: (game.players.X ? 1 : 0) + (game.players.O ? 1 : 0)
        });
    }
    res.json({ success: true, games });
});
(0, socket_1.setupSocketIO)(io);
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`GestPlay Backend is listening on port ${PORT}`);
});
