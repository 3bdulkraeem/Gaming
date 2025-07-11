import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

function FloatingShapes() {
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
    </group>
  );
}

export default function GameCanvas() {
  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <color attach="background" args={["#0f0f23"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      <Suspense fallback={null}>
        <FloatingShapes />
      </Suspense>
    </Canvas>
  );
}
