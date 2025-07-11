import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";
import { generateMemorySequence } from "@/lib/gameUtils";

export default function MemoryPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'result'>('showing');

  const sequenceLength = difficulty === 'easy' ? 3 + level : 
                         difficulty === 'medium' ? 4 + level : 5 + level;

  const initializeGame = useCallback(() => {
    const newSequence = generateMemorySequence(sequenceLength);
    setSequence(newSequence);
    setPlayerInput([]);
    setCurrentIndex(0);
    setGamePhase('showing');
    setShowingSequence(true);
  }, [sequenceLength]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gamePhase === 'showing' && showingSequence) {
      const timer = setTimeout(() => {
        if (currentIndex < sequence.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setShowingSequence(false);
          setGamePhase('input');
          setCurrentIndex(0);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, sequence, gamePhase, showingSequence]);

  const handleCellClick = (cellIndex: number) => {
    if (gamePhase !== 'input') return;

    const newPlayerInput = [...playerInput, cellIndex];
    setPlayerInput(newPlayerInput);

    if (newPlayerInput[newPlayerInput.length - 1] === sequence[newPlayerInput.length - 1]) {
      playHit();
      if (newPlayerInput.length === sequence.length) {
        playSuccess();
        addScore(10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
        setTimeout(() => {
          nextPuzzle();
        }, 1000);
      }
    } else {
      playHit();
      setTimeout(() => {
        initializeGame();
      }, 1000);
    }
  };

  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة الذاكرة</h3>
          <p className="text-gray-600">
            {gamePhase === 'showing' ? 'احفظ التسلسل' : 'اضغط على الخانات بنفس الترتيب'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {cells.map((cellIndex) => {
            const isActiveInSequence = gamePhase === 'showing' && 
                                     currentIndex > 0 && 
                                     sequence[currentIndex - 1] === cellIndex;
            const isClickedByPlayer = playerInput.includes(cellIndex);
            const shouldHighlight = isActiveInSequence || isClickedByPlayer;

            return (
              <Button
                key={cellIndex}
                onClick={() => handleCellClick(cellIndex)}
                className={`aspect-square text-2xl font-bold transition-all duration-300 ${
                  shouldHighlight 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white transform scale-105' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                disabled={gamePhase !== 'input'}
              >
                {cellIndex + 1}
              </Button>
            );
          })}
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            التقدم: {playerInput.length} / {sequence.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(playerInput.length / sequence.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
