import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RainParticlesProps {
  precipitation: number; // mm
  windSpeed: number; // km/h
  windDirection: number; // degrees
  isActive: boolean;
}

const MAX_RAIN_COUNT = 1500;
const scratchMatrix = new THREE.Matrix4();
const scratchPosition = new THREE.Vector3();
const scratchRotation = new THREE.Euler();
const scratchQuaternion = new THREE.Quaternion();
const scratchScale = new THREE.Vector3(1, 1, 1);

export function RainParticles({
  precipitation,
  windSpeed,
  windDirection,
  isActive,
}: RainParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Active count scales from 250 (drizzle) to 1500 (heavy downpour)
  const activeCount = useMemo(() => {
    if (!isActive || precipitation <= 0) return 0;
    const count = Math.round(Math.min(MAX_RAIN_COUNT, Math.max(300, precipitation * 200)));
    return count;
  }, [isActive, precipitation]);

  // Pre-allocate drop particle buffers
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(MAX_RAIN_COUNT * 3);
    const spd = new Float32Array(MAX_RAIN_COUNT);

    for (let i = 0; i < MAX_RAIN_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      spd[i] = 16 + Math.random() * 12; // falling speed
    }

    return [pos, spd];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || activeCount === 0) return;

    // Wind tilt vector
    const windRad = (windDirection * Math.PI) / 180;
    const windTiltX = Math.sin(windRad) * (windSpeed * 0.015);
    const windTiltZ = -Math.cos(windRad) * (windSpeed * 0.015);

    scratchRotation.set(windTiltZ * 0.4, 0, -windTiltX * 0.4);
    scratchQuaternion.setFromEuler(scratchRotation);

    const fallDistance = Math.min(0.8, delta * 24);

    for (let i = 0; i < activeCount; i++) {
      const idx = i * 3;
      let y = positions[idx + 1] - speeds[i] * fallDistance * 0.04;
      let x = positions[idx] + windTiltX * fallDistance;
      let z = positions[idx + 2] + windTiltZ * fallDistance;

      // Wrap around bounds
      if (y < -0.5) {
        y = 13 + Math.random() * 2;
        x = (Math.random() - 0.5) * 22;
        z = (Math.random() - 0.5) * 22;
      }

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      scratchPosition.set(x, y, z);
      scratchMatrix.compose(scratchPosition, scratchQuaternion, scratchScale);
      meshRef.current.setMatrixAt(i, scratchMatrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (activeCount === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, activeCount]}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.015, 0.015, 0.4, 3]} />
      <meshBasicMaterial color="#93C5FD" transparent opacity={0.65} />
    </instancedMesh>
  );
}
