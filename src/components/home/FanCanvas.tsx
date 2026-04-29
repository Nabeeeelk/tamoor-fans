"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, PresentationControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const FanModel = ({ speed = 0.005 }: { speed?: number }) => {
  const { scene } = useGLTF("/models/wooden_fan.glb");
  const fanRef = useRef<THREE.Group>(null);

  // We need to find the part of the fan that should spin (usually the blades and motor)
  // For simplicity, we rotate the whole group if it's built centered.
  useFrame((state, delta) => {
    if (fanRef.current) {
      // The Blender script builds it along the Z-axis, 
      // but in Three.js it might need an adjustment depending on export.
      fanRef.current.rotation.y += speed * 60 * delta;
    }
  });

  return (
    <primitive 
      ref={fanRef} 
      object={scene} 
      scale={1.2} 
      position={[0, -1, 0]} 
      rotation={[0, 0, 0]}
    />
  );
};

const FanCanvas = ({ speed = 0.005 }: { speed?: number }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={40} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -5, -10]} color="#3B82F6" intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <FanModel speed={speed} />
            </Float>
          </PresentationControls>
        </Suspense>

        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default FanCanvas;
