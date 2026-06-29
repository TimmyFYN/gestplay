"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Users, Activity, Eye } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
      <AnimatePresence>
        {showSplash ? (
          <Splash key="splash" />
        ) : (
          <LandingPage key="landing" />
        )}
      </AnimatePresence>
    </main>
  );
}

function Splash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 blur-3xl rounded-full bg-cyan-500/20 w-64 h-64 animate-pulse" />
        
        <Image src="/logo.svg" alt="GestPlay Logo" width={120} height={120} className="mb-6 drop-shadow-2xl" />
        
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
          GestPlay
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-4 text-slate-400 text-lg tracking-wide font-light"
        >
          Play with Gestures. Connect Without Limits.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="flex flex-col min-h-screen"
    >


      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6"
        >
          Board Games, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Reimagined.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 mb-10 max-w-2xl font-light leading-relaxed"
        >
          Experience Chess and Tic-Tac-Toe like never before. Control the board entirely with hand gestures through your webcam. No mouse required.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Link href="/play" className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
            Start Playing Free
          </Link>
          <Link href="/spectate" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all">
            Spectate Live Games
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Gamepad2 className="w-8 h-8 text-cyan-400" />}
              title="Gesture Control"
              desc="Pinch, swipe, and grab. Our low-latency AI maps your hands to the game board instantly."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-emerald-400" />}
              title="Real-time Multiplayer"
              desc="Play seamlessly with friends globally with state-of-the-art socket synchronization."
            />
            <FeatureCard 
              icon={<Eye className="w-8 h-8 text-purple-400" />}
              title="Spectator Mode"
              desc="Watch high-stakes matches live. Learn strategies from the best players."
            />
            <FeatureCard 
              icon={<Activity className="w-8 h-8 text-rose-400" />}
              title="Advanced Analytics"
              desc="Track your gesture accuracy, latency, and win/loss records over time."
            />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Powered by Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition duration-500">
          <span className="text-2xl font-bold tracking-widest">TensorFlow.js</span>
          <span className="text-2xl font-bold tracking-widest">MediaPipe</span>
          <span className="text-2xl font-bold tracking-widest">Socket.IO</span>
          <span className="text-2xl font-bold tracking-widest">Next.js</span>
          <span className="text-2xl font-bold tracking-widest">PostgreSQL</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} className="opacity-50" />
          <span className="font-semibold tracking-wide">GestPlay</span>
        </div>
        <p>&copy; {new Date().getFullYear()} GestPlay Final Year Project. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-3xl bg-slate-800/40 border border-white/5 backdrop-blur-md hover:bg-slate-800/60 transition group">
      <div className="mb-4 p-3 bg-slate-900 rounded-2xl inline-block group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
