import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { usePuzzleGame } from "./lib/stores/usePuzzleGame";
import "@fontsource/inter";

// Import game components
import MainMenu from "./components/game/MainMenu";
import DifficultySelector from "./components/game/DifficultySelector";
import PuzzleGame from "./components/game/PuzzleGame";
import ResultsScreen from "./components/game/ResultsScreen";
import GameUI from "./components/game/GameUI";
import SoundManager from "./components/game/SoundManager";
import FloatingShapes from "./components/game/FloatingShapes";

function App() {
  const { gamePhase } = usePuzzleGame();

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
        direction: 'rtl'
      }}
    >
      {/* 3D Canvas Background */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        camera={{
          position: [0, 0, 5],
          fov: 60,
          near: 0.1,
          far: 100
        }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
      </Canvas>

      {/* Game UI Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
        {gamePhase === 'menu' && <MainMenu />}
        {gamePhase === 'difficulty' && <DifficultySelector />}
        {gamePhase === 'playing' && (
          <>
            <PuzzleGame />
            <GameUI />
          </>
        )}
        {gamePhase === 'results' && <ResultsScreen />}
      </div>

      {/* Sound Manager */}
      <SoundManager />
    </div>
  );
}

export default App;
