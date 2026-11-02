import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WeatherConditionCategory } from '../../types/weather';

interface FogControllerProps {
  weatherCategory: WeatherConditionCategory;
  isDay: boolean;
  themeColors?: {
    sky: string;
    surface: string;
    text: string;
  };
}

const scratchFogColor = new THREE.Color();
const targetFogColor = new THREE.Color();

export function FogController({
  weatherCategory,
  isDay,
  themeColors,
}: FogControllerProps) {
  const { scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  useEffect(() => {
    if (!scene.fog) {
      const fog = new THREE.FogExp2(themeColors?.sky || '#0B0F17', 0.005);
      scene.fog = fog;
      fogRef.current = fog;
    } else {
      fogRef.current = scene.fog as THREE.FogExp2;
    }
  }, [scene, themeColors]);

  useFrame((_, delta) => {
    if (!fogRef.current) return;

    let targetDensity = 0.003;
    if (weatherCategory === 'fog') {
      targetDensity = 0.11;
    } else if (weatherCategory === 'thunderstorm') {
      targetDensity = 0.045;
    } else if (weatherCategory === 'rain' || weatherCategory === 'snow') {
      targetDensity = 0.03;
    } else if (weatherCategory === 'drizzle') {
      targetDensity = 0.022;
    } else if (weatherCategory === 'cloudy') {
      targetDensity = 0.012;
    }

    targetFogColor.set(themeColors?.sky || (isDay ? '#7DD3FC' : '#0B0F17'));

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
