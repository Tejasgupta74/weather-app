import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LowPolyLandscape } from './LowPolyLandscape';
import { SkyEnvironment } from './SkyEnvironment';
import { RainParticles } from './RainParticles';
import { SnowParticles } from './SnowParticles';
import { CloudLayers } from './CloudLayers';
import { FogController } from './FogController';
import { LightningEffect } from './LightningEffect';
import { SceneWeatherState } from '../../types/scene';
import { Phase } from '../../utils/solarPosition';

interface WeatherCanvasProps {
  weatherState: SceneWeatherState;
  themeColors?: {
    sky: string;
    surface: string;
    text: string;
  };
  phase?: Phase;
  children?: React.ReactNode;
}

const scratchCameraTarget = new THREE.Vector3();
const baseCameraPosition = new THREE.Vector3(0, 3.2, 10.5);

function CameraParallaxRig() {
  useFrame((state, delta) => {
    // Subtle mouse parallax dampening
    const mouseX = state.pointer.x * 0.8;
    const mouseY = state.pointer.y * 0.4;

    scratchCameraTarget.set(
      baseCameraPosition.x + mouseX,
      baseCameraPosition.y + mouseY,
      baseCameraPosition.z
    );

    state.camera.position.lerp(scratchCameraTarget, Math.min(1.0, delta * 2.0));
    state.camera.lookAt(0, 0.8, 0);
  });

  return null;
}

export function WeatherCanvas({
  weatherState,
  themeColors,
  phase,
  children,
}: WeatherCanvasProps) {
  const isSnowing = weatherState.weatherCategory === 'snow';
  const isRaining =
    weatherState.weatherCategory === 'rain' ||
    weatherState.weatherCategory === 'drizzle' ||
    weatherState.weatherCategory === 'thunderstorm' ||
    (weatherState.precipitation > 0 && !isSnowing);
  const isThunderstorm = weatherState.weatherCategory === 'thunderstorm';

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 3.2, 10.5], fov: 45 }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(
            themeColors?.sky || (weatherState.isDay ? '#38BDF8' : '#0B0F17')
          );
        }}
      >
        <CameraParallaxRig />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.05}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          rotateSpeed={0.4}
        />

        {/* Dynamic Sky & Solar/Lunar Lighting Rig */}
        <SkyEnvironment
          isDay={weatherState.isDay}
          sunAngle={weatherState.sunAngle}
          ambientFactor={weatherState.ambientFactor}
          themeColors={themeColors}
          phase={phase}
        />

        {/* Scene Fog Controller */}
        <FogController
          weatherCategory={weatherState.weatherCategory}
          isDay={weatherState.isDay}
          themeColors={themeColors}
        />

        {/* Interactive 3D Weather Globe */}
        <LowPolyLandscape
          isSnowing={isSnowing}
          windSpeed={weatherState.windSpeed}
          isDay={weatherState.isDay}
          isRaining={isRaining}
          latitude={weatherState.latitude}
          longitude={weatherState.longitude}
        />

        {/* Cloud Layers driven by cloudCover & wind */}
        <CloudLayers
          cloudCover={weatherState.cloudCover}
          windSpeed={weatherState.windSpeed}
          windDirection={weatherState.windDirection}
          isDay={weatherState.isDay}
        />

        {/* Instanced Rain Particles */}
        <RainParticles
          precipitation={weatherState.precipitation}
          windSpeed={weatherState.windSpeed}
          windDirection={weatherState.windDirection}
          isActive={isRaining}
        />

        {/* Instanced Snow Particles */}
        <SnowParticles
          windSpeed={weatherState.windSpeed}
          windDirection={weatherState.windDirection}
          isActive={isSnowing}
        />

        {/* Thunderstorm Lightning Strobe */}
        <LightningEffect isActive={isThunderstorm} />

        {/* Children Extension Slot */}
        {children}
      </Canvas>
    </div>
  );
}
