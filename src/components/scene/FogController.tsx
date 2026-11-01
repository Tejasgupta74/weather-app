import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WeatherConditionCategory } from '../../types/weather';

interface FogControllerProps {
  weatherCategory: WeatherConditionCategory;
  isDay: boolean;
}

const scratchFogColor = new THREE.Color();
const targetFogColor = new THREE.Color();

export function FogController({ weatherCategory, isDay }: FogControllerProps) {
  const { scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  // Initialize scene fog once
  useEffect(() => {
    if (!scene.fog) {
      const fog = new THREE.FogExp2('#0B0F17', 0.005);
      scene.fog = fog;
      fogRef.current = fog;
    } else {
      fogRef.current = scene.fog as THREE.FogExp2;
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (!fogRef.current) return;

    // Target density based on weather condition
    let targetDensity = 0.003; // Clear baseline
    if (weatherCategory === 'fog') {
      targetDensity = 0.045; // Dense atmospheric fog
    } else if (weatherCategory === 'rain' || weatherCategory === 'snow') {
      targetDensity = 0.018; // Atmospheric precipitation mist
    } else if (weatherCategory === 'cloudy') {
      targetDensity = 0.008; // Mild overcast hazing
    }

    // Target color
    if (isDay) {
      targetFogColor.set(weatherCategory === 'fog' ? '#94A3B8' : '#7DD3FC');
    } else {
      targetFogColor.set('#0B0F17');
    }

    // Smooth lerping
    const lerpRate = Math.min(1.0, delta * 2.0);
    fogRef.current.density = THREE.MathUtils.lerp(
      fogRef.current.density,
      targetDensity,
      lerpRate
    );

    scratchFogColor.copy(fogRef.current.color);
    scratchFogColor.lerp(targetFogColor, lerpRate);
    fogRef.current.color.copy(scratchFogColor);
  });

  return null;
}
