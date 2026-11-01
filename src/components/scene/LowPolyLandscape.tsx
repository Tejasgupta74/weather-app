import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LowPolyLandscapeProps {
  isSnowing?: boolean;
  windSpeed?: number;
  isDay?: boolean;
  isRaining?: boolean;
  latitude?: number;
  longitude?: number;
}

const GLOBE_RADIUS = 3.0;

// Scratch vectors for coordinate math without allocations in useFrame
const scratchTargetRotation = new THREE.Euler();
const scratchTargetQuat = new THREE.Quaternion();

function latLonToVector3(lat: number, lon: number, radius: number, out: THREE.Vector3): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return out.set(x, y, z);
}

export function LowPolyLandscape({
  isSnowing = false,
  latitude = 51.5074,
  longitude = -0.1278,
  isDay = true,
}: LowPolyLandscapeProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const cloudsShellRef = useRef<THREE.Group>(null);
  const pinBeaconRef = useRef<THREE.Mesh>(null);
  const pinRingRef = useRef<THREE.Mesh>(null);

  // Surface colors adapt to winter snow conditions
  const landColor = isSnowing ? '#E2E8F0' : '#15803D';
  const oceanColor = '#0F172A';

  // Major continental anchor clusters on the sphere surface
  const continentAnchors = useMemo(
    () => [
      // Europe
      { lat: 48, lon: 15, scale: 0.95 },
      { lat: 55, lon: 25, scale: 0.8 },
      { lat: 40, lon: -4, scale: 0.7 },
      // Africa
      { lat: 10, lon: 20, scale: 1.3 },
      { lat: -10, lon: 24, scale: 1.1 },
      { lat: 25, lon: 18, scale: 1.2 },
      { lat: -25, lon: 26, scale: 0.85 },
      // Asia
      { lat: 50, lon: 75, scale: 1.4 },
      { lat: 35, lon: 105, scale: 1.3 },
      { lat: 22, lon: 78, scale: 1.0 },
      { lat: 60, lon: 110, scale: 1.2 },
      { lat: 36, lon: 138, scale: 0.6 }, // Japan
      // North America
      { lat: 42, lon: -95, scale: 1.3 },
      { lat: 58, lon: -110, scale: 1.1 },
      { lat: 32, lon: -85, scale: 0.95 },
      { lat: 65, lon: -150, scale: 0.75 },
      // South America
      { lat: -12, lon: -55, scale: 1.2 },
      { lat: -32, lon: -62, scale: 0.9 },
      { lat: 5, lon: -70, scale: 0.8 },
      // Australia
      { lat: -24, lon: 134, scale: 1.0 },
      // Polar Ice Caps
      { lat: 88, lon: 0, scale: 1.3, isIce: true },
      { lat: -88, lon: 0, scale: 1.4, isIce: true },
    ],
    []
  );

  // Calculate coordinates of all land clusters once
  const continentData = useMemo(() => {
    return continentAnchors.map((c, i) => {
      const pos = new THREE.Vector3();
      latLonToVector3(c.lat, c.lon, GLOBE_RADIUS, pos);
      const normal = pos.clone().normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      return {
        id: `continent-${i}`,
        position: [pos.x, pos.y, pos.z] as [number, number, number],
        rotationQuaternion: quat,
        scale: c.scale,
        isIce: Boolean(c.isIce),
      };
    });
  }, [continentAnchors]);

  // City Pin position on the globe
  const cityPin = useMemo(() => {
    const pos = new THREE.Vector3();
    latLonToVector3(latitude, longitude, GLOBE_RADIUS + 0.02, pos);
    const normal = pos.clone().normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    return {
      position: [pos.x, pos.y, pos.z] as [number, number, number],
      normal,
      quaternion: quat,
    };
  }, [latitude, longitude]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Smoothly orient the globe so the selected city faces toward the viewer
    if (globeGroupRef.current) {
      // Rotate target: bring latitude to ~15 degrees and longitude to front face
      const targetRotY = (longitude * Math.PI) / 180 + Math.PI / 2;
      const targetRotX = ((-latitude + 15) * Math.PI) / 180;

      scratchTargetRotation.set(targetRotX, targetRotY, 0, 'YXZ');
      scratchTargetQuat.setFromEuler(scratchTargetRotation);

      globeGroupRef.current.quaternion.slerp(scratchTargetQuat, Math.min(1.0, delta * 2.5));
    }

    // 2. Slow atmospheric cloud layer orbit
    if (cloudsShellRef.current) {
      cloudsShellRef.current.rotation.y += delta * 0.04;
    }

    // 3. Pulsing location beacon at the target city
    if (pinBeaconRef.current && pinRingRef.current) {
      const pulse = Math.sin(time * 5.0) * 0.5 + 0.5;
      const beaconMat = pinBeaconRef.current.material as THREE.MeshStandardMaterial;
      const baseEmissive = isDay ? 1.0 : 1.8;
      beaconMat.emissiveIntensity = baseEmissive + pulse * 1.5;

      const ringScale = 1.0 + pulse * 0.8;
      pinRingRef.current.scale.set(ringScale, ringScale, ringScale);
      const ringMat = pinRingRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, 0.9 - pulse * 0.6);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Root Rotating Globe Assembly */}
      <group ref={globeGroupRef}>
        {/* Ocean Sphere Base */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[GLOBE_RADIUS, 36, 36]} />
          <meshStandardMaterial
            color={oceanColor}
            roughness={0.7}
            metalness={0.15}
            flatShading
          />
        </mesh>

        {/* Subtle Lat/Long Grid Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[GLOBE_RADIUS + 0.005, GLOBE_RADIUS + 0.02, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[GLOBE_RADIUS + 0.005, GLOBE_RADIUS + 0.02, 48]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>

        {/* Continental Low-Poly Landmasses */}
        {continentData.map((c) => (
          <group
            key={c.id}
            position={c.position}
            quaternion={c.rotationQuaternion}
            scale={c.scale}
          >
            {/* Primary Land Form */}
            <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.75, 0]} />
              <meshStandardMaterial
                color={c.isIce ? '#F1F5F9' : landColor}
                roughness={0.88}
                flatShading
              />
            </mesh>
            {/* Secondary Land Contour */}
            <mesh position={[0.4, 0.04, 0.2]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.55, 0]} />
              <meshStandardMaterial
                color={c.isIce ? '#F1F5F9' : landColor}
                roughness={0.88}
                flatShading
              />
            </mesh>
          </group>
        ))}

        {/* Selected City Location Pin Needle & Beacon */}
        <group position={cityPin.position} quaternion={cityPin.quaternion}>
          {/* Slender Pin Needle */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 6]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Glowing Beacon Head */}
          <mesh ref={pinBeaconRef} position={[0, 0.75, 0]} castShadow>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Pulsing Ground Wave Ring */}
          <mesh ref={pinRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.12, 0.25, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Atmospheric Cloud Sphere Shell */}
      <group ref={cloudsShellRef}>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.32, 24, 24]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.12}
            roughness={1}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Stylized Floating Cloud Puffs Orbiting the Globe */}
        <GlobeCloudPuff position={[3.25, 0.8, 1.2]} />
        <GlobeCloudPuff position={[-3.1, -0.6, -1.6]} />
        <GlobeCloudPuff position={[0.4, 3.2, -1.0]} />
        <GlobeCloudPuff position={[-1.2, -3.1, 1.4]} />
      </group>
    </group>
  );
}

function GlobeCloudPuff({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.45} flatShading />
      </mesh>
      <mesh position={[0.2, 0.1, 0]}>
        <dodecahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.45} flatShading />
      </mesh>
    </group>
  );
}
