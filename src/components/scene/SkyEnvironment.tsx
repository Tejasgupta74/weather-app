import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Phase } from '../../utils/solarPosition';

interface SkyEnvironmentProps {
  isDay: boolean;
  sunAngle: number;
  ambientFactor: number;
  themeColors?: {
    sky: string;
    surface: string;
    text: string;
  };
  phase?: Phase;
}

const scratchSkyColor = new THREE.Color();
const targetSkyColor = new THREE.Color();
const scratchLightColor = new THREE.Color();
const targetLightColor = new THREE.Color();
const scratchAmbientColor = new THREE.Color();
const targetAmbientColor = new THREE.Color();

export function SkyEnvironment({
  isDay,
  sunAngle,
  ambientFactor,
  themeColors,
  phase = 'day',
}: SkyEnvironmentProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);

  const [starPositions, starCount] = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.9);
      const r = 24 + Math.random() * 4;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return [positions, count];
  }, []);

  useFrame((state, delta) => {
    const lerpFactor = Math.min(1.0, delta * 2.0);

    const arcRadius = 14;
    const celestialX = -Math.cos(sunAngle) * arcRadius;
    const celestialY = Math.max(1, Math.sin(sunAngle) * arcRadius);
    const celestialZ = -4;

    if (sunMeshRef.current && moonMeshRef.current) {
      if (isDay) {
        sunMeshRef.current.position.set(celestialX, celestialY, celestialZ);
        moonMeshRef.current.position.set(0, -20, 0);
      } else {
        moonMeshRef.current.position.set(celestialX, celestialY, celestialZ);
        sunMeshRef.current.position.set(0, -20, 0);
      }
    }

    // Drive target colors from theme values
    targetSkyColor.set(themeColors?.sky || (isDay ? '#38BDF8' : '#0B0F17'));
    targetAmbientColor.set(themeColors?.surface || (isDay ? '#1E293B' : '#0F172A'));

    if (phase === 'dawn') {
      targetLightColor.set('#FDE68A');
    } else if (phase === 'day') {
      targetLightColor.set(themeColors?.sky || '#FFFBEB');
    } else {
      targetLightColor.set('#94A3B8');
    }

    // Target intensities
    const targetSunIntensity = isDay
      ? (phase === 'dawn' || phase === 'dusk' ? 0.9 : 1.3) * ambientFactor
      : 0.35;
    const targetAmbientIntensity = isDay
      ? (phase === 'dawn' || phase === 'dusk' ? 0.45 : 0.65) * ambientFactor
      : 0.25;

    // Smoothly lerp background clear color without allocation
    scratchSkyColor.copy((state.scene.background as THREE.Color) || targetSkyColor);
    scratchSkyColor.lerp(targetSkyColor, lerpFactor);
    state.scene.background = scratchSkyColor;

    // Smoothly lerp directional light color and intensity
    if (dirLightRef.current) {
      dirLightRef.current.position.set(celestialX, celestialY, celestialZ);
      scratchLightColor.copy(dirLightRef.current.color);
      scratchLightColor.lerp(targetLightColor, lerpFactor);
      dirLightRef.current.color.copy(scratchLightColor);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetSunIntensity,
        lerpFactor
      );
    }

    // Smoothly lerp ambient light color and intensity
    if (ambientLightRef.current) {
      scratchAmbientColor.copy(ambientLightRef.current.color);
      scratchAmbientColor.lerp(targetAmbientColor, lerpFactor);
      ambientLightRef.current.color.copy(scratchAmbientColor);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbientIntensity,
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
      <directionalLight
        ref={dirLightRef}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0005}
      />
      <ambientLight ref={ambientLightRef} />

      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>

      <mesh ref={moonMeshRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color="#E2E8F0" />
      </mesh>

      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
            count={starCount}
          />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#FFFFFF" transparent opacity={0} />
      </points>
    </>
  );
}
