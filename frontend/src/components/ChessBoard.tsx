"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Chess, Square } from "chess.js";
import { useGestureContext } from "@/context/GestureContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export function ChessBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const { gestureState } = useGestureContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [game] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myColor, setMyColor] = useState<"w" | "b" | "spectator" | null>(null);
  const [opponentPresent, setOpponentPresent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize Socket and Room ID
  useEffect(() => {
    let currentRoomId = searchParams.get("room");
    
    if (!currentRoomId) {
      currentRoomId = `chess-${Math.random().toString(36).substring(2, 9)}`;
      router.replace(`/play/chess?room=${currentRoomId}`);
    }
    
    setRoomId(currentRoomId);

    let playerId = sessionStorage.getItem("gestplay_player_id");
    if (!playerId) {
      playerId = `player-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("gestplay_player_id", playerId);
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_room", { roomId: currentRoomId, playerId });
    });

    newSocket.on("room_joined", (data) => {
      if (data.color) setMyColor(data.color);
      if (data.fen) {
        game.load(data.fen);
        setBoard(game.board());
      }
      setOpponentPresent(data.opponentPresent);
    });

    newSocket.on("player_joined", (data) => {
      setOpponentPresent(true);
    });

    newSocket.on("player_left", (data) => {
      if (data.color === 'w' || data.color === 'b') {
        setOpponentPresent(false);
      }
    });

    newSocket.on("move_made", (data) => {
      game.load(data.fen);
      setBoard(game.board());
    });

    newSocket.on("error", (data) => {
      console.error("Server Error:", data.message);
      game.undo();
      setBoard(game.board());
    });

    return () => {
      newSocket.close();
    };
  }, [searchParams, router, game]);

  const lastGesture = useRef(gestureState.gesture);
  const displayRanks = myColor === 'b' ? ['1','2','3','4','5','6','7','8'] : ['8','7','6','5','4','3','2','1'];
  const displayFiles = myColor === 'b' ? ['h','g','f','e','d','c','b','a'] : ['a','b','c','d','e','f','g','h'];

  const copyInviteLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!gestureState.cursorX || !gestureState.cursorY || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const cursorAbsX = gestureState.cursorX * window.innerWidth;
    const cursorAbsY = gestureState.cursorY * window.innerHeight;

    if (
      cursorAbsX >= rect.left &&
      cursorAbsX <= rect.right &&
      cursorAbsY >= rect.top &&
      cursorAbsY <= rect.bottom
    ) {
      const squareWidth = rect.width / 8;
      const squareHeight = rect.height / 8;
      
      const fileIndex = Math.floor((cursorAbsX - rect.left) / squareWidth);
      const rankIndex = Math.floor((cursorAbsY - rect.top) / squareHeight);

      if (fileIndex >= 0 && fileIndex < 8 && rankIndex >= 0 && rankIndex < 8) {
        const sq = (displayFiles[fileIndex] + displayRanks[rankIndex]) as Square;
        setHoveredSquare(sq);
      } else {
        setHoveredSquare(null);
      }
    } else {
      setHoveredSquare(null);
    }
  }, [gestureState.cursorX, gestureState.cursorY, displayFiles, displayRanks]);

  const handleSquareSelect = (sq: Square) => {
    if (selectedSquare) {
      try {
        const moveObj = game.move({
          from: selectedSquare,
          to: sq,
          promotion: "q",
        });
        if (moveObj) {
          setBoard(game.board());
          if (socket && roomId) {
            socket.emit("make_move", {
              roomId,
              move: moveObj.lan || `${selectedSquare}${sq}`
            });
          }
        }
      } catch (e) {}
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const piece = game.get(sq);
      if (piece && piece.color === game.turn() && piece.color === myColor) {
        setSelectedSquare(sq);
        const moves = game.moves({ square: sq, verbose: true });
        setValidMoves(moves.map(m => m.to as Square));
      }
    }
  };

  useEffect(() => {
    const prev = lastGesture.current;
    const current = gestureState.gesture;

    if (prev !== "PINCH" && current === "PINCH") {
      if (hoveredSquare) {
        handleSquareSelect(hoveredSquare);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
    lastGesture.current = current;
  }, [gestureState.gesture, hoveredSquare, selectedSquare, game, socket, roomId, myColor]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[min(100vw-2rem,800px,75vh)] flex justify-between items-end mb-4">
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-start min-w-[160px]">
          <div className="text-sm font-medium text-slate-400 mb-1 tracking-wider uppercase">
            Current Turn
          </div>
          <div className="text-2xl font-bold flex items-center gap-3">
             <span className={game.turn() === 'w' ? "text-slate-100" : "text-slate-500"}>
               White
             </span>
             <span className="text-slate-600 text-sm">vs</span>
             <span className={game.turn() === 'b' ? "text-slate-100" : "text-slate-500"}>
               Black
             </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs font-mono text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            Code: <span className="text-cyan-400 font-bold">{roomId}</span>
          </div>
          <button 
            onClick={copyInviteLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer backdrop-blur-md text-sm font-medium text-slate-300 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Invite Link"}
          </button>
        </div>
      </div>

      <div 
        ref={boardRef}
        className="grid grid-cols-8 grid-rows-8 w-full max-w-[min(100vw-2rem,800px,75vh)] aspect-square bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-2 md:p-4 shadow-2xl relative mx-auto"
      >
      {displayRanks.map((rank, rIndex) => (
        displayFiles.map((file, fIndex) => {
          const square = (file + rank) as Square;
          const isBlack = (rIndex + fIndex) % 2 !== 0;
          const piece = game.get(square);
          
          const isHovered = hoveredSquare === square;
          const isSelected = selectedSquare === square;
          const isValidMove = validMoves.includes(square);

          let bgClass = isBlack ? "bg-slate-700" : "bg-slate-300";
          
          if (isSelected) bgClass = "bg-emerald-500/80";
          else if (isHovered && isValidMove) bgClass = "bg-cyan-500/80";
          else if (isHovered && !isValidMove) bgClass = "bg-white/40";
          
          return (
            <div 
              key={square}
              onClick={() => handleSquareSelect(square)}
              className={`relative flex items-center justify-center transition-colors cursor-pointer ${bgClass}`}
            >
              {/* Highlight Valid Move Dot */}
              {isValidMove && !piece && (
                <div className="absolute w-4 h-4 rounded-full bg-black/20" />
              )}
              {isValidMove && piece && (
                <div className="absolute inset-0 border-4 border-black/20 rounded-full m-1" />
              )}

              {/* Piece Image */}
              {piece && (
                <motion.div
                  initial={false}
                  animate={{ scale: isSelected || (isHovered && !selectedSquare) ? 1.2 : 1 }}
                  className="w-[80%] h-[80%] relative z-10 drop-shadow-xl"
                >
                  <Image 
                    src={`/pieces/${piece.color}${piece.type.toUpperCase()}.svg`} 
                    alt={piece.type} 
                    fill 
                    className="object-contain"
                  />
                </motion.div>
              )}
            </div>
          );
        })
      ))}
      </div>
      
      {/* Player Status Footer */}
      {myColor && (
        <div className="mt-8 px-6 py-3 rounded-full bg-slate-800/80 backdrop-blur border border-white/10 text-sm font-semibold tracking-wider flex items-center gap-4">
          <span>YOU ARE: <span className={myColor === 'w' ? "text-slate-100" : myColor === 'b' ? "text-slate-500" : "text-slate-400"}>
            {myColor === 'spectator' ? 'SPECTATOR' : (myColor === 'w' ? 'WHITE' : 'BLACK')}
          </span></span>
          {myColor !== 'spectator' && !opponentPresent && (
            <span className="text-yellow-400 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Waiting for opponent...
            </span>
          )}
        </div>
      )}
    </div>
  );
}
