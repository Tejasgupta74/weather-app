import { useMemo } from 'react';

interface LowPolyLandscapeProps {
  isSnowing?: boolean;
  isDay?: boolean;
  isRaining?: boolean;
}

export function LowPolyLandscape({
  isSnowing = false,
  isDay = true,
}: LowPolyLandscapeProps) {
  // Ground, vegetation, and rock colors adapt to snow and day/night
  const groundColor = isSnowing ? '#E2E8F0' : (isDay ? '#365314' : '#142711');
  const hillColor = isSnowing ? '#F1F5F9' : (isDay ? '#2E4712' : '#0F1F0C');
  const treeFoliageColor = isSnowing ? '#F8FAFC' : (isDay ? '#15803D' : '#0B381A');
  const treeTrunkColor = '#5A3E2B';
  const rockColor = isDay ? '#64748B' : '#334155';
  const houseWallColor = isDay ? '#9A7B56' : '#57422C';
  const houseRoofColor = isSnowing ? '#FFFFFF' : (isDay ? '#78350F' : '#3B1F0E');

  // Pre-compute stable tree positions across the terrain
  const trees = useMemo(
    () => [
      { x: -5.5, z: -3.5, scale: 1.1 },
      { x: -4.2, z: -2.0, scale: 0.9 },
      { x: -6.2, z: -1.0, scale: 1.2 },
      { x: -3.0, z: -4.2, scale: 0.8 },
      { x: 4.5, z: -3.0, scale: 1.15 },
      { x: 5.8, z: -1.5, scale: 1.0 },
      { x: 3.5, z: -4.0, scale: 0.85 },
      { x: 6.5, z: -3.8, scale: 1.25 },
      { x: -1.8, z: -5.0, scale: 0.75 },
      { x: 1.5, z: -5.2, scale: 0.8 },
    ],
    []
  );

  // Pre-compute stable rock clusters
  const rocks = useMemo(
    () => [
      { x: -2.5, y: -0.3, z: -2.0, scale: 0.45 },
      { x: -2.0, y: -0.35, z: -1.8, scale: 0.3 },
      { x: 2.8, y: -0.35, z: -2.2, scale: 0.5 },
      { x: 3.4, y: -0.38, z: -1.9, scale: 0.35 },
      { x: -0.8, y: -0.38, z: -3.5, scale: 0.4 },
    ],
    []
  );

  return (
    <group position={[0, -0.6, 0]}>
      {/* Primary Low-Poly Ground Plateau */}
      <mesh position={[0, -0.8, -2]} receiveShadow>
        <cylinderGeometry args={[11, 12, 1.2, 18]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={0.9}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Background Rolling Hills */}
      <mesh position={[-6.5, 0.4, -6.5]} scale={[4.5, 2.5, 4.5]} receiveShadow>
        <coneGeometry args={[1, 1.2, 7]} />
        <meshStandardMaterial
          color={hillColor}
          roughness={0.95}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0.2, -8]} scale={[6.0, 2.8, 5.5]} receiveShadow>
        <coneGeometry args={[1, 1.2, 8]} />
        <meshStandardMaterial
          color={hillColor}
          roughness={0.95}
          flatShading
        />
      </mesh>
      <mesh position={[7.0, 0.5, -6.0]} scale={[4.8, 2.6, 4.8]} receiveShadow>
        <coneGeometry args={[1, 1.2, 7]} />
        <meshStandardMaterial
          color={hillColor}
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* Low-Poly Alpine Trees */}
      {trees.map((t, idx) => (
        <group key={idx} position={[t.x, -0.2, t.z]} scale={t.scale}>
          {/* Trunk */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 0.6, 5]} />
            <meshStandardMaterial color={treeTrunkColor} roughness={0.9} flatShading />
          </mesh>
          {/* Foliage Tier 1 */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <coneGeometry args={[0.55, 0.7, 5]} />
            <meshStandardMaterial color={treeFoliageColor} roughness={0.85} flatShading />
          </mesh>
          {/* Foliage Tier 2 */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <coneGeometry args={[0.42, 0.6, 5]} />
            <meshStandardMaterial color={treeFoliageColor} roughness={0.85} flatShading />
          </mesh>
          {/* Foliage Tier 3 */}
          <mesh position={[0, 1.62, 0]} castShadow>
            <coneGeometry args={[0.28, 0.5, 5]} />
            <meshStandardMaterial color={treeFoliageColor} roughness={0.85} flatShading />
          </mesh>
        </group>
      ))}

      {/* Scattered Low-Poly Rocks */}
      {rocks.map((r, idx) => (
        <mesh key={idx} position={[r.x, r.y, r.z]} scale={r.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* Low-Poly Cozy Alpine House */}
      <group position={[0.2, -0.2, -2.5]} rotation={[0, -0.2, 0]} scale={0.75}>
        {/* Main Cabin Walls */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.9, 1.0]} />
          <meshStandardMaterial color={houseWallColor} roughness={0.9} flatShading />
        </mesh>

        {/* Peaked Gable Roof */}
        <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.05, 0.7, 4]} />
          <meshStandardMaterial color={houseRoofColor} roughness={0.85} flatShading />
        </mesh>

        {/* Stone Chimney */}
        <mesh position={[0.35, 1.1, 0.2]} castShadow>
          <boxGeometry args={[0.22, 0.8, 0.22]} />
          <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
        </mesh>

        {/* Small Front Door */}
        <mesh position={[0, 0.3, 0.51]}>
          <planeGeometry args={[0.25, 0.5]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>

        {/* Warm Window Light */}
        <mesh position={[-0.32, 0.45, 0.51]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshStandardMaterial
            color={isDay ? '#FEF08A' : '#FBBF24'}
            emissive={isDay ? '#FEF08A' : '#FBBF24'}
            emissiveIntensity={isDay ? 0.3 : 1.2}
          />
        </mesh>
      </group>
    </group>
  );
}
