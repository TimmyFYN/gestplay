"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { Hand, HandMetal, HandFist } from "lucide-react";
import { useGestureContext } from "@/context/GestureContext";

export function GestureEngine({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { gestureState, setGestureState, hasCamera, setHasCamera, isLoaded, setIsLoaded } = useGestureContext();

  const { isLoaded: mediaPipeLoaded, error, onGesture } = useMediaPipe(videoRef);

  useEffect(() => {
    setIsLoaded(mediaPipeLoaded);
  }, [mediaPipeLoaded, setIsLoaded]);

  const setupDone = useRef(false);

  useEffect(() => {
    async function setupCamera() {
      if (setupDone.current) return;
      setupDone.current = true;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // autoPlay handles playing, no need to manually call play() which causes AbortErrors
          setHasCamera(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    setupCamera();
  }, []);

  useEffect(() => {
    // Smoothed cursor coordinates
    let smoothedX = 0.5;
    let smoothedY = 0.5;
    
    onGesture((state) => {
      // Basic exponential moving average smoothing
      // Reduced smoothing (0.85) for extremely fast, responsive tracking
      smoothedX = smoothedX + (state.cursorX - smoothedX) * 0.85;
      smoothedY = smoothedY + (state.cursorY - smoothedY) * 0.85;
      
      setGestureState({
        ...state,
        cursorX: smoothedX,
        cursorY: smoothedY,
      });
    });
  }, [onGesture]);

  if (error) {
    return (
      <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50">
        Failed to load AI Engine: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Hidden Webcam Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
        style={{ transform: "scaleX(-1)" }}
      />

      {/* Render children (like the Game Board) underneath the cursor */}
      {children}

      {/* Debug & Status Overlay */}
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3 text-sm font-mono">
          <div className={`w-3 h-3 rounded-full ${hasCamera && isLoaded ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          {hasCamera && isLoaded ? 'AI ACTIVE' : 'INITIALIZING...'}
        </div>
        
        {isLoaded && (
          <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 text-sm font-mono text-cyan-400">
            GESTURE: {gestureState.gesture}
          </div>
        )}
      </div>

      {/* Custom AI Cursor */}
      {hasCamera && isLoaded && gestureState.gesture !== "NONE" && (
        <motion.div
          className="absolute z-50 pointer-events-none drop-shadow-2xl"
          animate={{
            x: gestureState.cursorX * window.innerWidth,
            y: gestureState.cursorY * window.innerHeight,
            scale: gestureState.gesture === "PINCH" ? 0.8 : 1,
          }}
          transition={{
            type: "tween",
            duration: 0
          }}
          style={{ 
            translateX: "-50%", 
            translateY: "-50%" 
          }}
        >
          {gestureState.gesture === "OPEN_PALM" && <Hand className="w-12 h-12 text-white/80" />}
          {gestureState.gesture === "PINCH" && <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_rgba(6,182,212,0.8)]" />}
          {gestureState.gesture === "FIST" && <HandFist className="w-12 h-12 text-rose-400" />}
        </motion.div>
      )}
    </div>
  );
}
