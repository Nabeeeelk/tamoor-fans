'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export default function FanModel({ speed = 1, active = true }: { speed?: number, active?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const bladesRef = useRef<THREE.Group>(null);

  // Rotate blades
  useFrame((state, delta) => {
    if (bladesRef.current && active) {
      bladesRef.current.rotation.y += delta * 15 * speed;
    }
    
    if (groupRef.current) {
      // Subtle floating movement
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Fan Motor / Hub */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 32]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.8} 
            roughness={0.2} 
            emissive="#1e293b" 
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Bottom Cap */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.4, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Top Stem */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Blades Group */}
        <group ref={bladesRef} position={[0, -0.1, 0]}>
          {[0, 120, 240].map((rotation, i) => (
            <group key={i} rotation={[0, THREE.MathUtils.degToRad(rotation), 0]}>
              <mesh position={[1, 0, 0]} rotation={[0.1, 0, 0.1]}>
                <boxGeometry args={[1.8, 0.02, 0.4]} />
                <meshStandardMaterial 
                  color="#ffffff" 
                  metalness={0.2} 
                  roughness={0.8} 
                />
              </mesh>
              {/* Blade Attachment */}
              <mesh position={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.05, 0.1]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </Float>

      {/* Lighting & Environment */}
      <spotLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4.5} 
      />
    </group>
  );
}
