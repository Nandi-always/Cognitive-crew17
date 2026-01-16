'use client';

import { useEffect } from 'react';

export function useDeviceOrientation() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePermission = async () => {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.error('Device orientation permission denied:', error);
        }
      }
    };

    const handleOrientation = (_event) => {
      // Handle device orientation
    };

    handlePermission();

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
