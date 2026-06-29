"use client";

import { useEffect, useRef, useState } from "react";
import { useGestureContext } from "@/context/GestureContext";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useSearchParams, useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

type TTTSymbol = 'X' | 'O' | null;

export function TicTacToeBoard() {
  const { gestureState } = useGestureContext();
  const boardRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [myColor, setMyColor] = useState<"X" | "O" | "spectator" | null>(null);
  const [copied, setCopied] = useState(false);

  // Game State
  const [board, setBoard] = useState<TTTSymbol[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [status, setStatus] = useState<"active" | "win_X" | "win_O" | "draw">("active");

  // Interaction State
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastGesture = useRef(gestureState.gesture);

  // Initialize Socket and Room ID
  useEffect(() => {
    let currentRoomId = searchParams.get("room");
    
    if (!currentRoomId) {
      currentRoomId = `ttt-${Math.random().toString(36).substring(2, 9)}`;
      router.replace(`/play/tictactoe?room=${currentRoomId}`);
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
      newSocket.emit("join_ttt_room", { roomId: currentRoomId, playerId });
    });

    newSocket.on("ttt_room_joined", (data) => {
      if (data.color) setMyColor(data.color);
      if (data.board) setBoard(data.board);
      if (data.turn) setTurn(data.turn);
      if (data.status) setStatus(data.status);
    });

    newSocket.on("ttt_move_made", (data) => {
      setBoard(data.board);
      setTurn(data.turn);
      setStatus(data.status);
    });

    return () => {
      newSocket.close();
    };
  }, [roomId]);

  // Process gesture coordinates to map to 3x3 grid
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
      const cellWidth = rect.width / 3;
      const cellHeight = rect.height / 3;
      
      const colIndex = Math.floor((cursorAbsX - rect.left) / cellWidth);
      const rowIndex = Math.floor((cursorAbsY - rect.top) / cellHeight);

      if (colIndex >= 0 && colIndex < 3 && rowIndex >= 0 && rowIndex < 3) {
        setHoveredIndex(rowIndex * 3 + colIndex);
      } else {
        setHoveredIndex(null);
      }
    } else {
      setHoveredIndex(null);
    }
  }, [gestureState.cursorX, gestureState.cursorY]);

  const handleCellClick = (idx: number) => {
    if (status === "active") {
      if (myColor !== "spectator" && turn === myColor) {
        if (board[idx] === null) {
          if (socket) {
            socket.emit("make_ttt_move", {
              roomId,
              index: idx
            });
          }
        }
      }
    }
  };

  // Handle Pinch (Click) Logic
  useEffect(() => {
    const prev = lastGesture.current;
    const current = gestureState.gesture;

    if (prev !== "PINCH" && current === "PINCH") {
      if (hoveredIndex !== null) {
        handleCellClick(hoveredIndex);
      }
    }

    lastGesture.current = current;
  }, [gestureState.gesture, hoveredIndex, status, myColor, turn, board, socket, roomId]);

  // Render cell content
  const renderSymbol = (symbol: TTTSymbol) => {
    if (!symbol) return null;
    
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full h-full flex items-center justify-center relative z-10"
      >
        {symbol === 'X' ? (
          <span className="text-8xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">X</span>
        ) : (
          <span className="text-8xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">O</span>
        )}
      </motion.div>
    );
  };

  const copyInviteLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* Header controls */}
      <div className="w-full max-w-[min(100vw-2rem,600px,70vh)] flex justify-between items-end mb-4">
        {/* Turn indicator */}
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-start min-w-[160px]">
          <div className="text-sm font-medium text-slate-400 mb-1 tracking-wider uppercase">
            {status === "active" ? "Current Turn" : "Game Over"}
          </div>
          <div className="text-2xl font-bold">
            {status === "active" ? (
               <span className={turn === 'X' ? "text-cyan-400" : "text-emerald-400"}>
                 Player {turn}
               </span>
            ) : status === "draw" ? (
               <span className="text-yellow-400">DRAW</span>
            ) : (
               <span className={status === "win_X" ? "text-cyan-400" : "text-emerald-400"}>
                 {status === "win_X" ? "Player X Wins!" : "Player O Wins!"}
               </span>
            )}
          </div>
        </div>

        {/* Invite Link */}
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs font-mono text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            Code: <span className="text-emerald-400 font-bold">{roomId}</span>
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

      {/* Board */}
      <div 
        ref={boardRef}
        className="w-full max-w-[min(100vw-2rem,600px,70vh)] aspect-square bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-2">
          {board.map((symbol, idx) => {
            const isHovered = hoveredIndex === idx;
            const canPlay = status === "active" && turn === myColor && symbol === null;
            
            return (
              <div 
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`relative flex items-center justify-center rounded-2xl transition-colors duration-300 cursor-pointer ${
                  isHovered 
                    ? canPlay 
                      ? myColor === 'X' ? "bg-cyan-500/20" : "bg-emerald-500/20" 
                      : "bg-white/5" 
                    : "bg-slate-800/40"
                }`}
              >
                {/* Cell Border (Tic Tac Toe Lines) */}
                <div className="absolute inset-0 border border-white/5 rounded-2xl" />
                
                {renderSymbol(symbol)}
                
                {/* Preview on hover */}
                {isHovered && canPlay && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                     <span className={`text-8xl font-black ${myColor === 'X' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                       {myColor}
                     </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Status Footer */}
      {myColor && (
        <div className="mt-8 px-6 py-3 rounded-full bg-slate-800/80 backdrop-blur border border-white/10 text-sm font-semibold tracking-wider">
          YOU ARE PLAYING AS: <span className={myColor === 'X' ? "text-cyan-400" : myColor === 'O' ? "text-emerald-400" : "text-slate-400"}>
            {myColor === 'spectator' ? 'SPECTATOR' : `PLAYER ${myColor}`}
          </span>
        </div>
      )}
    </div>
  );
}
