# GestPlay Socket.IO Event Documentation

## Connection
Clients connect to the Socket.IO server at `ws://localhost:4000`.

## Client -> Server Events

### `create_room`
Requests the creation of a new game room.
- **Payload**: `{ "gameType": "CHESS" }`
- **Expected Response**: Server emits `room_created`.

### `join_room`
Requests to join an existing game room (as player or spectator).
- **Payload**: `{ "roomId": "room-1234" }`
- **Expected Response**: Server emits `room_joined` to the user and `player_joined` to others.

### `make_move`
Broadcasts a move to the room.
- **Payload**: `{ "roomId": "room-1234", "move": "e2e4", "fen": "new_fen_string" }`
- **Expected Response**: Server broadcasts `move_made` to all other clients in the room.

## Server -> Client Events

### `room_created`
Sent to the client after successfully creating a room.
- **Payload**: `{ "roomId": "room-1234" }`

### `room_joined`
Sent to the client after successfully joining a room.
- **Payload**: `{ "roomId": "room-1234", "gameState": { ... } }`

### `player_joined`
Broadcast to clients in a room when a new player or spectator joins.
- **Payload**: `{ "playerId": "socket_id_or_user_id" }`

### `move_made`
Broadcast to all clients in a room when a valid move is played.
- **Payload**: `{ "move": "e2e4", "fen": "new_fen_string", "playerId": "sender_id" }`
