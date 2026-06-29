import { GestureEngine } from "@/components/GestureEngine";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GestureProvider } from "@/context/GestureContext";
import { TicTacToeBoard } from "@/components/TicTacToeBoard";
import { Suspense } from "react";

export default function TicTacToeRoom() {
  return (
    <GestureProvider>
      <main className="h-[100dvh] w-screen bg-slate-950 text-white overflow-hidden flex flex-col">
        <GestureEngine>
          {/* Game UI Layer */}
          <div className="absolute inset-0 flex flex-col pointer-events-auto">
            {/* Header */}
            <header className="p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5 relative z-50">
              <Link href="/play" className="flex items-center gap-2 hover:text-cyan-400 transition cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Hub</span>
              </Link>
              <div className="font-bold text-xl tracking-widest text-emerald-400">
                TIC-TAC-TOE MATCH
              </div>
              <div className="w-24"></div> {/* spacer */}
            </header>

            {/* Board Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 relative">
              {/* Background ambient light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
              
              <Suspense fallback={<div className="text-emerald-400">Loading Board...</div>}>
                <TicTacToeBoard />
              </Suspense>
            </div>
          </div>
        </GestureEngine>
      </main>
    </GestureProvider>
  );
}
