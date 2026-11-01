import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SkyEnvironmentProps {
  isDay: boolean;
  sunAngle: number;
  ambientFactor: number;
}

// Scratch objects allocated once to prevent garbage collection inside useFrame
const scratchSkyColor = new THREE.Color();
const targetSkyColor = new THREE.Color();
const scratchLightColor = new THREE.Color();
const targetLightColor = new THREE.Color();

export function SkyEnvironment({ isDay, sunAngle, ambientFactor }: SkyEnvironmentProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  // Generate 400 random star coordinates once
  const [starPositions, starCount] = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.9); // Top hemisphere
      const r = 24 + Math.random() * 4;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return [positions, count];
  }, []);

  useFrame((state, delta) => {
    const lerpFactor = Math.min(1.0, delta * 2.5);

    // Calculate celestial positions along an arc
    const arcRadius = 14;
    const celestialX = -Math.cos(sunAngle) * arcRadius;
    const celestialY = Math.max(1, Math.sin(sunAngle) * arcRadius);
    const celestialZ = -4;

    if (sunMeshRef.current && moonMeshRef.current) {
      if (isDay) {
        sunMeshRef.current.position.set(celestialX, celestialY, celestialZ);
        moonMeshRef.current.position.set(0, -20, 0); // Hide below ground
      } else {
        moonMeshRef.current.position.set(celestialX, celestialY, celestialZ);
        sunMeshRef.current.position.set(0, -20, 0); // Hide below ground
      }
    }

    // Determine target lighting colors and intensities
    if (isDay) {
      // Daylight color transitions: sunrise/sunset warm amber vs noon bright sky
      const isLowSun = sunAngle < 0.35 || sunAngle > Math.PI - 0.35;
      targetSkyColor.set(isLowSun ? '#D97706' : '#38BDF8');
      targetLightColor.set(isLowSun ? '#FDE68A' : '#FFFBEB');
    } else {
      // Midnight deep slate navy
      targetSkyColor.set('#0B0F17');
      targetLightColor.set('#94A3B8');
    }

    // Lerp background clear color smoothly
    scratchSkyColor.copy(state.scene.background as THREE.Color || targetSkyColor);
    scratchSkyColor.lerp(targetSkyColor, lerpFactor);
    state.scene.background = scratchSkyColor;

    // Update lights
    if (dirLightRef.current) {
      dirLightRef.current.position.set(celestialX, celestialY, celestialZ);
      scratchLightColor.copy(dirLightRef.current.color);
      scratchLightColor.lerp(targetLightColor, lerpFactor);
      dirLightRef.current.color.copy(scratchLightColor);

      const targetIntensity = isDay ? 1.4 * ambientFactor : 0.35;
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetIntensity,
        lerpFactor
      );
    }

    if (ambientLightRef.current) {
      const targetAmbient = isDay ? 0.65 * ambientFactor : 0.25;
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbient,
        lerpFactor
      );
    }

    // Stars visibility
    if (starsRef.current) {
      const starsMat = starsRef.current.material as THREE.PointsMaterial;
      const targetStarOpacity = isDay ? 0 : 0.85;
      starsMat.opacity = THREE.MathUtils.lerp(starsMat.opacity, targetStarOpacity, lerpFactor);
      starsMat.transparent = true;
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <directionalLight
        ref={dirLightRef}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Sun Mesh */}
      <mesh ref={sunMeshRef} position={[0, 10, -5]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* Moon Mesh */}
      <mesh ref={moonMeshRef} position={[0, -20, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.6} emissive="#CBD5E1" emissiveIntensity={0.2} />
      </mesh>

      {/* Star Field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
            count={starCount}
          />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#F8FAFC" transparent opacity={0} />
      </points>
    </>
  );
}
