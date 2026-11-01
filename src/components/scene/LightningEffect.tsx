import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightningEffectProps {
  isActive: boolean;
}

export function LightningEffect({ isActive }: LightningEffectProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const flashTimer = useRef(2.5); // countdown to next strike
  const flashDuration = useRef(0); // active flash elapsed time

  useFrame((_, delta) => {
    if (!lightRef.current) return;

    if (!isActive) {
      lightRef.current.intensity = 0;
      return;
    }

    flashTimer.current -= delta;

    if (flashTimer.current <= 0) {
      // Trigger a multi-stage lightning flash sequence lasting ~250ms
      flashDuration.current = 0.25;
      flashTimer.current = 3.5 + Math.random() * 5.0; // Next flash in 3.5 - 8.5 seconds
      // Randomize flash position slightly in the sky
      lightRef.current.position.set(
        (Math.random() - 0.5) * 16,
        8 + Math.random() * 4,
        -4 + (Math.random() - 0.5) * 8
      );
    }

    if (flashDuration.current > 0) {
      flashDuration.current -= delta;
      const progress = 1 - Math.max(0, flashDuration.current / 0.25);

      // Realistic double-strobe lightning curve
      let pulse = 0;
      if (progress < 0.25) {
        pulse = 1.0; // First sharp flash
      } else if (progress < 0.45) {
        pulse = 0.2; // Quick dip
      } else if (progress < 0.75) {
        pulse = 0.85; // Secondary flash
      } else {
        pulse = Math.max(0, 1.0 - (progress - 0.75) * 4); // Fast decay
      }

      lightRef.current.intensity = pulse * 7.5;
    } else {
      lightRef.current.intensity = 0;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color="#E0F2FE"
      intensity={0}
      distance={35}
      decay={2}
    />
  );
}
