"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GameSelectionHub() {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;

    let targetUrl = "";
    
    // Check if it's a full URL
    if (joinCode.includes("http")) {
      targetUrl = joinCode;
    } else {
      // It's just a code like "chess-123" or "ttt-456"
      if (joinCode.startsWith("chess-")) {
        targetUrl = `/play/chess?room=${joinCode}`;
      } else if (joinCode.startsWith("ttt-")) {
        targetUrl = `/play/tictactoe?room=${joinCode}`;
      } else {
        alert("Invalid room code format. It should start with 'chess-' or 'ttt-'");
        return;
      }
    }
    
    router.push(targetUrl);
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
          <Link href="/play/chess">
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
          </Link>

          {/* Tic-Tac-Toe Card */}
          <Link href="/play/tictactoe">
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
          </Link>
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
              placeholder="e.g. chess-x8f2a or paste full URL" 
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
    </main>
  );
}
