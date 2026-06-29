"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";

export type GestureType = "NONE" | "PINCH" | "FIST" | "THUMBS_UP" | "OPEN_PALM";

export interface GestureState {
  gesture: GestureType;
  confidence: number;
  cursorX: number; // 0 to 1
  cursorY: number; // 0 to 1
}

export function useMediaPipe(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  
  // Callback for when a frame is processed
  const onResultsRef = useRef<(state: GestureState) => void>(() => {});

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (!active) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.7,
          minHandPresenceConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        if (!active) return;
        landmarkerRef.current = landmarker;
        setIsLoaded(true);
      } catch (err: any) {
        console.error("Failed to load MediaPipe:", err);
        setError(err.message);
      }
    }

    init();

    return () => {
      active = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  const lastGestureRef = useRef<GestureType>("NONE");

  const detectGesture = useCallback((landmarks: any[], lastGesture: GestureType): GestureType => {
    // 0: Wrist, 4: Thumb tip, 8: Index tip, 12: Middle tip, 16: Ring tip, 20: Pinky tip
    // Basic heuristic gesture detection
    
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];

    // Distance function
    const dist = (p1: any, p2: any) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    const pinchDist = dist(thumbTip, indexTip);
    
    // Hysteresis: If we are already pinching, require a larger distance to break the pinch.
    const isCurrentlyPinching = lastGesture === "PINCH";
    const pinchThreshold = isCurrentlyPinching ? 0.10 : 0.05;
    
    // Check Pinch: Thumb and Index close together, other fingers extended
    if (pinchDist < pinchThreshold && dist(middleTip, wrist) > 0.15) {
      return "PINCH";
    }

    // Hysteresis: If already fist, require more distance to break
    const isCurrentlyFist = lastGesture === "FIST";
    const fistThreshold = isCurrentlyFist ? 0.28 : 0.20;

    // Check Fist: All tips close to wrist
    const isFist = 
      dist(indexTip, wrist) < fistThreshold && 
      dist(middleTip, wrist) < fistThreshold && 
      dist(ringTip, wrist) < fistThreshold && 
      dist(pinkyTip, wrist) < fistThreshold;
      
    if (isFist) return "FIST";

    // Open Palm: Fingers extended
    const isOpen = 
      dist(indexTip, wrist) > 0.2 && 
      dist(middleTip, wrist) > 0.2 && 
      dist(ringTip, wrist) > 0.2;
      
    if (isOpen) return "OPEN_PALM";

    return "OPEN_PALM"; // Default to open palm if hand is detected but loosely open
  }, []);

  useEffect(() => {
    if (!isLoaded || !videoRef.current) return;

    const video = videoRef.current;
    let requestAnimationId: number;
    let lastVideoTime = -1;

    const renderLoop = async () => {
      if (video.readyState >= 2 && landmarkerRef.current) {
        const startTimeMs = performance.now();
        if (video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          
          try {
            const results = landmarkerRef.current.detectForVideo(video, startTimeMs);
            
            if (results.landmarks && results.landmarks.length > 0) {
              const hand = results.landmarks[0];
              const gesture = detectGesture(hand, lastGestureRef.current);
              lastGestureRef.current = gesture;
              
              // Cursor mapped to middle finger knuckle (hand[9]) for extreme stability during pinch
              // This prevents the "mismove" jump that happens when the index finger physically moves to pinch
              const cursorX = 1 - hand[9].x;
              const cursorY = hand[9].y;

              onResultsRef.current({
                gesture,
                confidence: results.handedness[0][0].score,
                cursorX,
                cursorY
              });
            } else {
               lastGestureRef.current = "NONE";
               onResultsRef.current({ gesture: "NONE", confidence: 0, cursorX: 0.5, cursorY: 0.5 });
            }
          } catch (e) {
            console.error("MediaPipe inference error:", e);
          }
        }
      }
      requestAnimationId = requestAnimationFrame(renderLoop);
    };

    if (video.readyState >= 2) {
      renderLoop();
    } else {
      video.addEventListener("loadeddata", renderLoop);
    }
    
    return () => {
      video.removeEventListener("loadeddata", renderLoop);
      cancelAnimationFrame(requestAnimationId);
    };
  }, [isLoaded, videoRef, detectGesture]);

  const onGesture = useCallback((cb: (state: GestureState) => void) => {
    onResultsRef.current = cb;
  }, []);

  return { isLoaded, error, onGesture };
}
