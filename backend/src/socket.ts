import { Server, Socket } from 'socket.io';

export const activeGames: Record<string, { 
  fen: string, 
  players: { white: string | null, black: string | null },
  sockets: { white: string | null, black: string | null }
}> = {};

type TTTSymbol = 'X' | 'O' | null;

export const activeTicTacToeGames: Record<string, {
  board: TTTSymbol[];
  turn: 'X' | 'O';
  status: 'active' | 'win_X' | 'win_O' | 'draw';
  players: { X: string | null, O: string | null };
  sockets: { X: string | null, O: string | null };
}> = {};

const checkTTTWin = (board: TTTSymbol[]): TTTSymbol => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Create Room
    socket.on('create_room', () => {
      const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
      activeGames[roomId] = { 
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        players: { white: null, black: null },
        sockets: { white: null, black: null }
      };
      socket.join(roomId);
      socket.emit('room_created', { roomId });
      console.log(`Room created: ${roomId}`);
    });

    // Join Room
    socket.on('join_room', (data) => {
      const { roomId, playerId } = data;
      
      // We require a playerId from the client to persist sessions across React StrictMode hot reloads
      const effectivePlayerId = playerId || socket.id;
      (socket as any).playerId = effectivePlayerId;

      // If the game doesn't exist in our memory, initialize it.
      if (!activeGames[roomId]) {
        activeGames[roomId] = { 
          fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          players: { white: null, black: null },
          sockets: { white: null, black: null }
        };
      }

      const game = activeGames[roomId];
      let assignedColor = null;

      if (game.players.white === effectivePlayerId) {
        assignedColor = 'w';
        game.sockets.white = socket.id;
      } else if (game.players.black === effectivePlayerId) {
        assignedColor = 'b';
        game.sockets.black = socket.id;
      } else if (!game.players.white) {
        game.players.white = effectivePlayerId;
        game.sockets.white = socket.id;
        assignedColor = 'w';
      } else if (!game.players.black) {
        game.players.black = effectivePlayerId;
        game.sockets.black = socket.id;
        assignedColor = 'b';
      } else {
        assignedColor = 'spectator';
      }

      socket.join(roomId);
      socket.to(roomId).emit('player_joined', { playerId: effectivePlayerId, color: assignedColor });
      socket.emit('room_joined', { roomId, fen: game.fen, color: assignedColor });
      console.log(`User ${effectivePlayerId} (Socket ${socket.id}) joined room: ${roomId} as ${assignedColor}`);
    });

    // Make Move
    socket.on('make_move', async (data) => {
      const { roomId, move } = data; // move is e.g. "e2e4"
      const game = activeGames[roomId];
      
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      try {
        const engineUrl = process.env.PYTHON_ENGINE_URL || process.env.ENGINE_URL || 'http://127.0.0.1:5000';
        const response = await fetch(`${engineUrl}/chess/validate_move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen: game.fen, move })
        });
        
        const result = await response.json();
        
        if (result.valid) {
          game.fen = result.fen;
          io.to(roomId).emit('move_made', { 
            move, 
            fen: result.fen, 
            playerId: (socket as any).playerId,
            is_check: result.is_check,
            is_checkmate: result.is_checkmate,
            is_draw: result.is_draw
          });
        } else {
          socket.emit('error', { message: 'Invalid move detected by engine' });
        }
      } catch (err) {
        console.error('Python Engine connection error:', err);
        socket.emit('error', { message: 'Game engine unavailable' });
      }
    });

    // TIC-TAC-TOE LOGIC

    socket.on('join_ttt_room', (data) => {
      const { roomId, playerId } = data;
      const effectivePlayerId = playerId || socket.id;
      (socket as any).playerId = effectivePlayerId;

      if (!activeTicTacToeGames[roomId]) {
        activeTicTacToeGames[roomId] = {
          board: Array(9).fill(null),
          turn: 'X',
          status: 'active',
          players: { X: null, O: null },
          sockets: { X: null, O: null }
        };
      }

      const game = activeTicTacToeGames[roomId];
      let assignedColor = null;

      if (game.players.X === effectivePlayerId) {
        assignedColor = 'X';
        game.sockets.X = socket.id;
      } else if (game.players.O === effectivePlayerId) {
        assignedColor = 'O';
        game.sockets.O = socket.id;
      } else if (!game.players.X) {
        game.players.X = effectivePlayerId;
        game.sockets.X = socket.id;
        assignedColor = 'X';
      } else if (!game.players.O) {
        game.players.O = effectivePlayerId;
        game.sockets.O = socket.id;
        assignedColor = 'O';
      } else {
        assignedColor = 'spectator';
      }

      socket.join(roomId);
      socket.to(roomId).emit('ttt_player_joined', { playerId: effectivePlayerId, color: assignedColor });
      socket.emit('ttt_room_joined', { roomId, board: game.board, turn: game.turn, status: game.status, color: assignedColor });
      console.log(`User ${effectivePlayerId} joined TTT room: ${roomId} as ${assignedColor}`);
    });

    socket.on('make_ttt_move', (data) => {
      const { roomId, index } = data;
      const game = activeTicTacToeGames[roomId];
      const playerId = (socket as any).playerId;

      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      if (game.status !== 'active') return;

      const isPlayerX = game.players.X === playerId;
      const isPlayerO = game.players.O === playerId;

      if ((game.turn === 'X' && !isPlayerX) || (game.turn === 'O' && !isPlayerO)) {
        return; // Not this player's turn
      }

      if (game.board[index] !== null) {
        return; // Cell already taken
      }

      // Apply move
      game.board[index] = game.turn;

      // Check win/draw
      const winner = checkTTTWin(game.board);
      if (winner) {
        game.status = winner === 'X' ? 'win_X' : 'win_O';
      } else if (!game.board.includes(null)) {
        game.status = 'draw';
      } else {
        game.turn = game.turn === 'X' ? 'O' : 'X';
      }

      io.to(roomId).emit('ttt_move_made', {
        board: game.board,
        turn: game.turn,
        status: game.status,
        lastMoveIndex: index,
        playerId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      const playerId = (socket as any).playerId;
      
      for (const roomId in activeGames) {
        const game = activeGames[roomId];
        // Only free the slot if the disconnecting socket is the currently active one for that slot
        if (game.players.white === playerId && game.sockets.white === socket.id) {
          game.players.white = null;
          game.sockets.white = null;
          console.log(`Freed White slot in ${roomId}`);
        }
        if (game.players.black === playerId && game.sockets.black === socket.id) {
          game.players.black = null;
          game.sockets.black = null;
          console.log(`Freed Black slot in ${roomId}`);
        }
      }

      for (const roomId in activeTicTacToeGames) {
        const game = activeTicTacToeGames[roomId];
        if (game.players.X === playerId && game.sockets.X === socket.id) {
          game.players.X = null;
          game.sockets.X = null;
          console.log(`Freed X slot in ${roomId}`);
        }
        if (game.players.O === playerId && game.sockets.O === socket.id) {
          game.players.O = null;
          game.sockets.O = null;
          console.log(`Freed O slot in ${roomId}`);
        }
      }
    });
  });
};
