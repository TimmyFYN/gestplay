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
