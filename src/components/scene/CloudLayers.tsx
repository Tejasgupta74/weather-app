import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloudLayersProps {
  cloudCover: number; // 0 to 100
  windSpeed: number; // km/h
  windDirection: number; // degrees
  isDay: boolean;
}

interface CloudData {
  initialX: number;
  y: number;
  initialZ: number;
  scale: number;
  speedMultiplier: number;
}

export function CloudLayers({
  cloudCover,
  windSpeed,
  windDirection,
  isDay,
}: CloudLayersProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Cloud opacity and layer count scale with cloudCover
  const cloudOpacity = useMemo(() => {
    if (cloudCover <= 5) return 0;
    return Math.min(0.85, Math.max(0.15, (cloudCover / 100) * 0.9));
  }, [cloudCover]);

  const cloudColor = isDay ? '#F1F5F9' : '#334155';

  // Fixed set of 6 cloud clusters with varied initial offsets
  const clouds: CloudData[] = useMemo(
    () => [
      { initialX: -9, y: 7.2, initialZ: -6, scale: 1.1, speedMultiplier: 1.0 },
      { initialX: 4, y: 8.5, initialZ: -8, scale: 1.3, speedMultiplier: 0.8 },
      { initialX: -3, y: 6.8, initialZ: -3, scale: 0.9, speedMultiplier: 1.2 },
      { initialX: 8, y: 7.6, initialZ: -4, scale: 1.0, speedMultiplier: 0.9 },
      { initialX: -7, y: 9.0, initialZ: -10, scale: 1.4, speedMultiplier: 0.7 },
      { initialX: 2, y: 7.0, initialZ: 1, scale: 0.85, speedMultiplier: 1.1 },
    ],
    []
  );

  // Store runtime positions in Float32Array to avoid allocations
  const currentPositions = useRef<Float32Array>(
    new Float32Array(clouds.flatMap((c) => [c.initialX, c.y, c.initialZ]))
  );

  useFrame((_, delta) => {
    if (!groupRef.current || cloudOpacity === 0) return;

    const windRad = (windDirection * Math.PI) / 180;
    const baseDrift = Math.max(0.5, windSpeed * 0.04) * delta;
    const driftX = Math.sin(windRad) * baseDrift;
    const driftZ = -Math.cos(windRad) * baseDrift;

    const children = groupRef.current.children;

    for (let i = 0; i < clouds.length; i++) {
      const idx = i * 3;
      let x = currentPositions.current[idx] + driftX * clouds[i].speedMultiplier;
      let z = currentPositions.current[idx + 2] + driftZ * clouds[i].speedMultiplier;

      // Wrap around bounds [-18, 18]
      if (x > 18) x = -18;
      if (x < -18) x = 18;
      if (z > 14) z = -14;
      if (z < -14) z = 14;

      currentPositions.current[idx] = x;
      currentPositions.current[idx + 2] = z;

      if (children[i]) {
        children[i].position.set(x, clouds[i].y, z);
      }
    }
  });

  if (cloudOpacity === 0) return null;

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, index) => (
        <group
          key={index}
          position={[cloud.initialX, cloud.y, cloud.initialZ]}
          scale={cloud.scale}
        >
          {/* Low-Poly Cloud Cluster */}
          <mesh position={[0, 0, 0]}>
            <dodecahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial
              color={cloudColor}
              roughness={0.9}
              transparent
              opacity={cloudOpacity}
              flatShading
            />
          </mesh>
          <mesh position={[-0.9, -0.2, 0.2]}>
            <dodecahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial
              color={cloudColor}
              roughness={0.9}
              transparent
              opacity={cloudOpacity}
              flatShading
            />
          </mesh>
          <mesh position={[0.9, -0.1, -0.1]}>
            <dodecahedronGeometry args={[0.95, 1]} />
            <meshStandardMaterial
              color={cloudColor}
              roughness={0.9}
              transparent
              opacity={cloudOpacity}
              flatShading
            />
          </mesh>
          <mesh position={[0.2, 0.4, 0.2]}>
            <dodecahedronGeometry args={[0.75, 1]} />
            <meshStandardMaterial
              color={cloudColor}
              roughness={0.9}
              transparent
              opacity={cloudOpacity}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
