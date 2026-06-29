# GestPlay REST API Documentation

## Base URL
`http://localhost:4000/api`

## Authentication

### `POST /auth/register`
Create a new user account.
- **Body**: `{ "username": "player1", "email": "test@test.com", "password": "secure" }`
- **Response**: `201 Created` - `{ "token": "jwt_token", "user": { "id": "uuid", "username": "player1" } }`

### `POST /auth/login`
Authenticate an existing user.
- **Body**: `{ "email": "test@test.com", "password": "secure" }`
- **Response**: `200 OK` - `{ "token": "jwt_token", "user": { "id": "uuid", "username": "player1" } }`

## Users

### `GET /users/me`
Get the current authenticated user's profile and stats.
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: `200 OK` - `{ "username": "player1", "winRate": 0.75, "gamesPlayed": 10 }`

## Matches

### `POST /matches`
Create a new match record.
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: `{ "gameType": "CHESS" }`
- **Response**: `201 Created` - `{ "matchId": "uuid", "status": "WAITING" }`

### `GET /matches/:id`
Get the state and history of a match.
- **Response**: `200 OK` - `{ "id": "uuid", "fen": "...", "status": "ACTIVE", "player1": {...}, "player2": {...} }`
