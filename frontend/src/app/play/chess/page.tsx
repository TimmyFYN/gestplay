import { GestureEngine } from "@/components/GestureEngine";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GestureProvider } from "@/context/GestureContext";
import { Suspense } from "react";

import { ChessBoard } from "@/components/ChessBoard";

export default function PlayRoom() {
  return (
    <GestureProvider>
      <main className="h-[100dvh] w-screen bg-slate-950 text-white overflow-hidden flex flex-col">
        <GestureEngine>
        {/* Game UI Layer */}
        <div className="absolute inset-0 flex flex-col pointer-events-auto">
          {/* Header */}
          <header className="p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 hover:text-cyan-400 transition cursor-pointer relative z-50">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Lobby</span>
            </Link>
            <div className="font-bold text-xl tracking-widest text-emerald-400">
              MATCH IN PROGRESS
            </div>
            <div className="w-24"></div> {/* spacer */}
          </header>

          {/* Interactive Playground for Testing Gestures */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
            <Suspense fallback={<div className="text-emerald-400">Loading Board...</div>}>
              <ChessBoard />
            </Suspense>
          </div>
        </div>
      </GestureEngine>
    </main>
    </GestureProvider>
  );
}
