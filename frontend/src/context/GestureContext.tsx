"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GestureState } from "@/hooks/useMediaPipe";

interface GestureContextValue {
  gestureState: GestureState;
  setGestureState: (state: GestureState) => void;
  hasCamera: boolean;
  setHasCamera: (val: boolean) => void;
  isLoaded: boolean;
  setIsLoaded: (val: boolean) => void;
}

const GestureContext = createContext<GestureContextValue | null>(null);

export function GestureProvider({ children }: { children: ReactNode }) {
  const [gestureState, setGestureState] = useState<GestureState>({
    gesture: "NONE",
    confidence: 0,
    cursorX: 0.5,
    cursorY: 0.5,
  });
  const [hasCamera, setHasCamera] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <GestureContext.Provider
      value={{
        gestureState,
        setGestureState,
        hasCamera,
        setHasCamera,
        isLoaded,
        setIsLoaded,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export function useGestureContext() {
  const ctx = useContext(GestureContext);
  if (!ctx) {
    throw new Error("useGestureContext must be used within a GestureProvider");
  }
  return ctx;
}
