import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Camera } from 'three';
import { useLayoutStore, Room } from '@/lib/stores/layout';

interface Keyframe {
  position: [number, number, number];
  target: [number, number, number];
  duration: number; // Duration to reach this keyframe in seconds
}

/**
 * Generate walkthrough keyframes from room layout
 * Creates a path through all rooms in order
 */
export function generateWalkthroughKeyframes(rooms: Room[]): Keyframe[] {
  if (rooms.length === 0) {
    return [
      {
        position: [5, 1.7, 8],
        target: [0, 1.5, 0],
        duration: 3,
      },
    ];
  }

  const keyframes: Keyframe[] = [];

  // Start at center, looking around
  keyframes.push({
    position: [0, 1.7, 0],
    target: [0, 1.5, 0],
    duration: 2,
  });

  // Visit each room
  rooms.forEach((room, index) => {
    const centerX = room.x / 40 + room.width / 80;
    const centerZ = room.y / 40 + room.height / 80;

    // Entry to room
    keyframes.push({
      position: [centerX - 1.5, 1.7, centerZ - 1.5],
      target: [centerX, 1.5, centerZ],
      duration: 2 + index * 0.5,
    });

    // Pan across room
    keyframes.push({
      position: [centerX + 1, 1.7, centerZ],
      target: [centerX, 1.5, centerZ],
      duration: 1.5,
    });

    // Pan other direction
    keyframes.push({
      position: [centerX, 1.7, centerZ + 1],
      target: [centerX, 1.5, centerZ],
      duration: 1.5,
    });
  });

  // Return to center
  keyframes.push({
    position: [0, 1.7, 5],
    target: [0, 1.5, 0],
    duration: 3,
  });

  return keyframes;
}

/**
 * Interpolate between two 3D points
 */
function interpolateVector(start: Vector3, end: Vector3, t: number): Vector3 {
  return new Vector3(
    start.x + (end.x - start.x) * t,
    start.y + (end.y - start.y) * t,
    start.z + (end.z - start.z) * t
  );
}

interface WalkthroughControllerProps {
  isPlaying: boolean;
  speed?: number; // Playback speed multiplier (default 1.0)
  onComplete?: () => void;
}

/**
 * 3D Walkthrough Controller with keyframe animation
 * Automatically animates camera through rooms with easing
 */
export function WalkthroughController({
  isPlaying,
  speed = 1.0,
  onComplete,
}: WalkthroughControllerProps) {
  const { camera } = useThree();
  const { rooms } = useLayoutStore();

  const keyframesRef = useRef<Keyframe[]>([]);
  const elapsedRef = useRef(0);
  const currentKeyframeRef = useRef(0);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (isPlaying) {
      elapsedRef.current = 0;
      currentKeyframeRef.current = 0;
      keyframesRef.current = generateWalkthroughKeyframes(rooms);
    }
  }, [isPlaying, rooms]);

  useFrame((_, delta) => {
    if (!isPlayingRef.current || keyframesRef.current.length === 0) return;

    elapsedRef.current += delta * speed;

    const keyframes = keyframesRef.current;
    let currentKf = currentKeyframeRef.current;

    // Find current and next keyframe
    while (currentKf < keyframes.length - 1 && elapsedRef.current > keyframes[currentKf].duration) {
      elapsedRef.current -= keyframes[currentKf].duration;
      currentKf++;
    }

    currentKeyframeRef.current = currentKf;

    // Check if animation is complete
    if (
      currentKf >= keyframes.length - 1 &&
      elapsedRef.current > keyframes[keyframes.length - 1].duration
    ) {
      isPlayingRef.current = false;
      onComplete?.();
      return;
    }

    const currentKeyframe = keyframes[currentKf];
    const duration = currentKeyframe.duration;
    const progress = Math.min(elapsedRef.current / duration, 1);

    // Easing function (ease-in-out cubic)
    const easeProgress =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Interpolate position
    const startPos = new Vector3(
      ...(keyframes[Math.max(0, currentKf - 1)]?.position || currentKeyframe.position)
    );
    const endPos = new Vector3(...currentKeyframe.position);
    const newPos = interpolateVector(startPos, endPos, easeProgress);

    // Interpolate target/lookAt
    const startTarget = new Vector3(
      ...(keyframes[Math.max(0, currentKf - 1)]?.target || currentKeyframe.target)
    );
    const endTarget = new Vector3(...currentKeyframe.target);
    const newTarget = interpolateVector(startTarget, endTarget, easeProgress);

    // Apply camera movement
    camera.position.lerp(newPos, 0.1);
    camera.lookAt(newTarget);
  });

  return null;
}

/**
 * Hook to manage walkthrough playback
 */
export function useWalkthrough() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [progress, setProgress] = useState(0);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const resume = () => setIsPlaying(true);
  const stop = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return {
    isPlaying,
    speed,
    progress,
    play,
    pause,
    resume,
    stop,
    setSpeed,
  };
}
