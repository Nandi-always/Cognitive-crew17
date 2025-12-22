'use client';

import { useEffect } from 'react';

export function useDeviceOrientation() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePermission = async () => {
      if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('Device orientation permission denied:', error);
        }
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Handle device orientation
    };

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
}

export function useMediaDevices() {
  useEffect(() => {
    const hasAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (error) {
        console.error('Camera access denied:', error);
        return false;
      }
    };

    hasAccess();
  }, []);
}
