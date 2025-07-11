import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating geometric shapes */}
      <mesh position={[-3, 2, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      
      <mesh position={[3, -1, -3]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      
      <mesh position={[0, -2, -4]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      
      <mesh position={[-2, -1, -5]}>
        <tetrahedronGeometry args={[0.35]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      
      <mesh position={[2, 1, -6]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#6366f1" />
      </mesh>
      
      <mesh position={[-1, 2, -3]}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
    </group>
  );
}