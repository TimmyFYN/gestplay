from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import chess

app = FastAPI(title="GestPlay Game Engine")

class ChessMoveRequest(BaseModel):
    fen: str
    move: str # e.g. "e2e4"

class ChessMoveResponse(BaseModel):
    valid: bool
    fen: str
    is_check: bool
    is_checkmate: bool
    is_draw: bool

@app.get("/health")
def health_check():
    return {"status": "GestPlay Python Engine Running"}

@app.post("/chess/validate_move", response_model=ChessMoveResponse)
def validate_move(req: ChessMoveRequest):
    try:
        board = chess.Board(req.fen)
        move = chess.Move.from_uci(req.move)
        
        if move in board.legal_moves:
            board.push(move)
            return ChessMoveResponse(
                valid=True,
                fen=board.fen(),
                is_check=board.is_check(),
                is_checkmate=board.is_checkmate(),
                is_draw=board.is_game_over() and not board.is_checkmate()
            )
        else:
            return ChessMoveResponse(
                valid=False,
                fen=req.fen,
                is_check=board.is_check(),
                is_checkmate=board.is_checkmate(),
                is_draw=board.is_game_over() and not board.is_checkmate()
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
