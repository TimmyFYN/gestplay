import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Cpu, BookOpen, Layers } from "lucide-react";

export const metadata = {
  title: "About - GestPlay",
  description: "About the GestPlay Project",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="flex items-center p-6 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <Image src="/logo.svg" alt="GestPlay Logo" width={80} height={80} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">About GestPlay</h1>
          <p className="text-xl text-slate-400 font-light">Final Year Computer Science Project</p>
        </div>

        <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Project Objectives</h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            GestPlay is a modern, web-based platform designed to make board games accessible and interactive using cutting-edge computer vision. The goal is to allow users to play Chess and Tic-Tac-Toe completely hands-free by mapping hand gestures via their webcam to game board interactions.
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-2">
            <li>Achieve &lt;50ms latency for real-time gesture tracking.</li>
            <li>Implement robust, synchronized multiplayer gameplay.</li>
            <li>Support massive concurrent spectator broadcasting.</li>
            <li>Provide a seamless, premium SaaS-like user experience.</li>
          </ul>
        </section>

        <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">System Architecture & Tech Stack</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-cyan-300">Frontend (Client)</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Next.js 14 (App Router)</li>
                <li>• React & TypeScript</li>
                <li>• Tailwind CSS & Framer Motion</li>
                <li>• MediaPipe Tasks Vision (Client-side AI)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-emerald-300">Backend & Engine</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Node.js & Express</li>
                <li>• Socket.IO for WebSockets</li>
                <li>• PostgreSQL & Prisma ORM</li>
                <li>• Python FastAPI & python-chess</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Gesture Workflow</h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            The platform relies on MediaPipe Hands running directly in the browser via WebAssembly. This avoids network latency caused by video streaming. Hand landmarks are extracted at 30+ FPS. A deterministic heuristics engine maps structural hand poses (Pinch, Fist, Thumbs Up) to discrete actions.
          </p>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto border border-white/5">
            1. Capture WebCam Frame <br/>
            2. Extract 21 3D Landmarks <br/>
            3. Apply Temporal Smoothing <br/>
            4. Detect Hand Pose (e.g. Pinch) <br/>
            5. Map to Raycast Coordinate <br/>
            6. Trigger Game Board Action
          </div>
        </section>

        <div className="text-center pt-8 border-t border-white/10 text-slate-500">
          <p>Project Code: GestPlay | Supervisor: Available on request</p>
        </div>
      </div>
    </main>
  );
}
