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
