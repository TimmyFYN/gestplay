"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Eye, Play, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActiveGame {
  roomId: string;
  gameType: "chess" | "tictactoe";
  status: string;
  playerCount: number;
}

export default function SpectatorDashboard() {
  const [games, setGames] = useState<ActiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchGames = async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/games/active");
      const data = await res.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (err) {
      console.error("Failed to fetch games", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    // Poll every 3 seconds for live updates
    const interval = setInterval(fetchGames, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSpectate = (game: ActiveGame) => {
    router.push(`/play/${game.gameType}?room=${game.roomId}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-x-hidden relative flex flex-col">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />


      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"
          >
            Live Matches
          </motion.h1>
          
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium">Auto-updating</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-slate-900/20 border border-white/5 rounded-3xl backdrop-blur-sm">
            <Shield className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400">No active matches</h3>
            <p className="text-slate-500 mt-2">Start a game to see it appear here!</p>
            <Link href="/play" className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors">
              Host a Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, i) => (
              <motion.div
                key={game.roomId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-slate-900/50 backdrop-blur border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300">
                      {game.gameType}
                    </div>
                    {game.status === "active" ? (
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        IN PROGRESS
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">
                        GAME OVER
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border ${game.gameType === 'chess' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                      {game.gameType === 'chess' ? '♔' : 'X'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-mono text-slate-200">
                        {game.roomId}
                      </h2>
                      <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                        <Users className="w-4 h-4" />
                        <span>{game.playerCount}/2 Players Connected</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpectate(game)}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                  >
                    <Eye className="w-5 h-5" />
                    Watch Match
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
