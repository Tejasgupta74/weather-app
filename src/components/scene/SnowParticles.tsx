import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowParticlesProps {
  windSpeed: number; // km/h
  windDirection: number; // degrees
  isActive: boolean;
}

const SNOW_COUNT = 800;
const scratchMatrix = new THREE.Matrix4();
const scratchPosition = new THREE.Vector3();
const scratchScale = new THREE.Vector3(1, 1, 1);
const identityQuaternion = new THREE.Quaternion();

export function SnowParticles({ windSpeed, windDirection, isActive }: SnowParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Pre-allocate buffer data: [x, y, z, speed, swayPhase, scale]
  const [positions, speeds, phases, scales] = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const spd = new Float32Array(SNOW_COUNT);
    const phs = new Float32Array(SNOW_COUNT);
    const scl = new Float32Array(SNOW_COUNT);

    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      spd[i] = 1.6 + Math.random() * 1.8; // Slow drifting speed
      phs[i] = Math.random() * Math.PI * 2;
      scl[i] = 0.6 + Math.random() * 0.8;
    }

    return [pos, spd, phs, scl];
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !isActive) return;

    const time = state.clock.getElapsedTime();
    const windRad = (windDirection * Math.PI) / 180;
    const windDriftX = Math.sin(windRad) * (windSpeed * 0.02);
    const windDriftZ = -Math.cos(windRad) * (windSpeed * 0.02);

    const fallDistance = Math.min(0.2, delta * 3);

    for (let i = 0; i < SNOW_COUNT; i++) {
      const idx = i * 3;
      let y = positions[idx + 1] - speeds[i] * fallDistance;
      const sway = Math.sin(time * 2.2 + phases[i]) * 0.015;

      let x = positions[idx] + windDriftX * fallDistance + sway;
      let z = positions[idx + 2] + windDriftZ * fallDistance + sway;

      // Wrap around bounds
      if (y < -0.4) {
        y = 13 + Math.random() * 2;
        x = (Math.random() - 0.5) * 22;
        z = (Math.random() - 0.5) * 22;
      }

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      scratchPosition.set(x, y, z);
      scratchScale.setScalar(scales[i]);
      scratchMatrix.compose(scratchPosition, identityQuaternion, scratchScale);
      meshRef.current.setMatrixAt(i, scratchMatrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isActive) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, SNOW_COUNT]}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial color="#F8FAFC" transparent opacity={0.85} />
    </instancedMesh>
  );
}
