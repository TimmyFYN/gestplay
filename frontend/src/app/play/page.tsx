"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GameSelectionHub() {
  const [joinCode, setJoinCode] = useState("");
  const [showCreateModal, setShowCreateModal] = useState<"chess" | "tictactoe" | null>(null);
  const [createCode, setCreateCode] = useState("");
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;

    let targetCode = joinCode.trim().toUpperCase();

    // Check if it's a full URL
    if (targetCode.includes("HTTP")) {
      router.push(joinCode.trim());
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/games/active`);
      const data = await res.json();
      const game = data.games.find((g: any) => g.roomId.toUpperCase() === targetCode);
      
      if (game) {
        router.push(`/play/${game.gameType}?room=${game.roomId}`);
      } else {
        alert("Room not found or no longer active. Please check the code and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server to find the room.");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCode = createCode.trim().toUpperCase();
    if (!finalCode) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      finalCode = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
    router.push(`/play/${showCreateModal}?room=${finalCode}`);
  };
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />


      {/* Selection Cards */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-12 md:mt-24 relative z-10">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-4xl md:text-5xl font-black mb-16 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400"
        >
          Choose Your Arena
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Chess Card */}
          {/* Chess Card */}
          <div onClick={() => setShowCreateModal("chess")}>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group h-80 rounded-3xl p-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-500" />
              <div className="h-full w-full bg-slate-950 rounded-[22px] p-8 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-5xl">♔</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-slate-100 group-hover:text-cyan-400 transition-colors">Chess</h2>
                <p className="text-slate-400">Master strategy with full gesture control. Real-time engine validation.</p>
              </div>
            </motion.div>
          </div>

          {/* Tic-Tac-Toe Card */}
          <div onClick={() => setShowCreateModal("tictactoe")}>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group h-80 rounded-3xl p-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-500" />
              <div className="h-full w-full bg-slate-950 rounded-[22px] p-8 flex flex-col items-center justify-center text-center relative z-10">
                <div className="w-24 h-24 mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 gap-2">
                  <span className="text-4xl text-emerald-400 font-bold">X</span>
                  <span className="text-4xl text-emerald-400 font-bold">O</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-slate-100 group-hover:text-emerald-400 transition-colors">Tic-Tac-Toe</h2>
                <p className="text-slate-400">Fast-paced classic. Drop your marks instantly with a pinch.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Join Existing Room */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-16 w-full max-w-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-200">Have an Invite Link or Code?</h3>
          </div>
          <form onSubmit={handleJoin} className="flex gap-4">
            <input 
              type="text" 
              placeholder="e.g. TIMMY or paste full URL" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!joinCode}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-xl font-bold transition-all"
            >
              Join Match
            </button>
          </form>
        </motion.div>
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={() => setShowCreateModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold mb-2 text-white">
                Create {showCreateModal === "chess" ? "Chess" : "Tic-Tac-Toe"} Match
              </h3>
              <p className="text-slate-400 mb-6 text-sm">
                Enter a custom game code to share, or leave blank to auto-generate a short code.
              </p>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input 
                  type="text"
                  maxLength={12}
                  placeholder="e.g. TIMMY" 
                  value={createCode}
                  onChange={(e) => setCreateCode(e.target.value)}
                  className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold tracking-wider placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors uppercase"
                />
                <button 
                  type="submit"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition-all text-lg text-white"
                >
                  Start Match
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
