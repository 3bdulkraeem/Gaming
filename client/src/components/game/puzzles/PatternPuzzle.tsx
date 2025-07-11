import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";

interface PatternCell {
  id: number;
  color: string;
  isActive: boolean;
}

export default function PatternPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [pattern, setPattern] = useState<PatternCell[]>([]);
  const [userPattern, setUserPattern] = useState<PatternCell[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'result'>('showing');
  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  const gridSize = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const patternComplexity = difficulty === 'easy' ? 3 + level : 
                           difficulty === 'medium' ? 4 + level : 
                           5 + level;

  const colors = [
    '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  const generatePattern = useCallback(() => {
    const totalCells = gridSize * gridSize;
    const newPattern = Array.from({ length: totalCells }, (_, i) => ({
      id: i,
      color: '#e5e7eb',
      isActive: false
    }));

    // Create a symmetric or geometric pattern
    const activeIndices = new Set<number>();
    
    if (difficulty === 'easy') {
      // Simple line or cross patterns
      const center = Math.floor(gridSize / 2);
      for (let i = 0; i < gridSize; i++) {
        activeIndices.add(center * gridSize + i); // Horizontal line
        activeIndices.add(i * gridSize + center); // Vertical line
      }
    } else if (difficulty === 'medium') {
      // Diagonal patterns
      for (let i = 0; i < gridSize; i++) {
        activeIndices.add(i * gridSize + i); // Main diagonal
        activeIndices.add(i * gridSize + (gridSize - 1 - i)); // Anti-diagonal
      }
    } else {
      // Complex geometric patterns
      const center = Math.floor(gridSize / 2);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const distance = Math.abs(i - center) + Math.abs(j - center);
          if (distance <= 1 || distance === Math.floor(gridSize / 2)) {
            activeIndices.add(i * gridSize + j);
          }
        }
      }
    }

    // Apply colors to active cells
    const colorIndex = Math.floor(Math.random() * colors.length);
    activeIndices.forEach(index => {
      newPattern[index].isActive = true;
      newPattern[index].color = colors[colorIndex];
    });

    return newPattern;
  }, [difficulty, gridSize, level]);

  const initializeGame = useCallback(() => {
    const newPattern = generatePattern();
    setPattern(newPattern);
    setUserPattern(Array.from({ length: gridSize * gridSize }, (_, i) => ({
      id: i,
      color: '#e5e7eb',
      isActive: false
    })));
    setSelectedCells([]);
    setGamePhase('showing');
    setShowingPattern(true);
  }, [generatePattern, gridSize]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gamePhase === 'showing' && showingPattern) {
      const timer = setTimeout(() => {
        setShowingPattern(false);
        setGamePhase('input');
      }, difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2500 : 2000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, showingPattern, difficulty]);

  const handleCellClick = (cellId: number) => {
    if (gamePhase !== 'input') return;

    const newUserPattern = [...userPattern];
    const newSelectedCells = [...selectedCells];

    if (selectedCells.includes(cellId)) {
      // Deselect cell
      newUserPattern[cellId] = {
        ...newUserPattern[cellId],
        isActive: false,
        color: '#e5e7eb'
      };
      setSelectedCells(newSelectedCells.filter(id => id !== cellId));
    } else {
      // Select cell
      const patternColor = pattern.find(cell => cell.isActive)?.color || colors[0];
      newUserPattern[cellId] = {
        ...newUserPattern[cellId],
        isActive: true,
        color: patternColor
      };
      newSelectedCells.push(cellId);
      setSelectedCells(newSelectedCells);
    }

    setUserPattern(newUserPattern);
  };

  const checkPattern = () => {
    if (gamePhase !== 'input') return;

    const isCorrect = pattern.every(cell => 
      cell.isActive === userPattern[cell.id].isActive
    );

    setGamePhase('result');
    
    if (isCorrect) {
      playSuccess();
      addScore(25 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setTimeout(() => {
        nextPuzzle();
      }, 1500);
    } else {
      playHit();
      setTimeout(() => {
        initializeGame();
      }, 2000);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة الأنماط</h3>
          <p className="text-gray-600">
            {gamePhase === 'showing' ? 'احفظ النمط' : 'أعد رسم النمط'}
          </p>
        </div>

        {/* Pattern Display */}
        <div className="mb-6">
          <div 
            className="grid gap-2 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              maxWidth: '300px'
            }}
          >
            {(gamePhase === 'showing' ? pattern : userPattern).map((cell) => (
              <Button
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                className={`aspect-square text-sm font-bold transition-all duration-300 ${
                  cell.isActive 
                    ? 'transform scale-105 shadow-lg' 
                    : 'hover:transform hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: cell.color,
                  borderColor: cell.isActive ? '#374151' : '#d1d5db'
                }}
                disabled={gamePhase !== 'input'}
              >
                {cell.isActive && gamePhase === 'showing' && '●'}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        {gamePhase === 'input' && (
          <div className="text-center mb-4">
            <Button
              onClick={checkPattern}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2"
              disabled={selectedCells.length === 0}
            >
              تحقق من النمط
            </Button>
          </div>
        )}

        {/* Result Display */}
        {gamePhase === 'result' && (
          <div className="text-center">
            <div className={`text-lg font-bold ${
              pattern.every(cell => cell.isActive === userPattern[cell.id].isActive)
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {pattern.every(cell => cell.isActive === userPattern[cell.id].isActive)
                ? 'نمط صحيح! 🎉' : 'نمط خاطئ، حاول مرة أخرى 😊'}
            </div>
          </div>
        )}

        {/* Progress Info */}
        <div className="text-center mt-4">
          <div className="text-sm text-gray-600">
            الخلايا المحددة: {selectedCells.length} | المستوى: {level}
          </div>
        </div>
      </div>
    </Card>
  );
}