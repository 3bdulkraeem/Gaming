import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";
import { generateColorPattern } from "@/lib/gameUtils";

export default function ColorPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [targetColor, setTargetColor] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const colors = [
    { name: 'أحمر', value: '#ef4444', arabic: 'أحمر' },
    { name: 'أزرق', value: '#3b82f6', arabic: 'أزرق' },
    { name: 'أخضر', value: '#22c55e', arabic: 'أخضر' },
    { name: 'أصفر', value: '#eab308', arabic: 'أصفر' },
    { name: 'بنفسجي', value: '#a855f7', arabic: 'بنفسجي' },
    { name: 'برتقالي', value: '#f97316', arabic: 'برتقالي' },
    { name: 'وردي', value: '#ec4899', arabic: 'وردي' },
    { name: 'سماوي', value: '#06b6d4', arabic: 'سماوي' }
  ];

  const initializeGame = useCallback(() => {
    const numOptions = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const { target, options: colorOptions } = generateColorPattern(colors, numOptions);
    setTargetColor(target);
    setOptions(colorOptions);
    setSelectedColor('');
    setShowResult(false);
  }, [difficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleColorClick = (color: string) => {
    if (showResult) return;
    
    setSelectedColor(color);
    setShowResult(true);
    
    if (color === targetColor) {
      playSuccess();
      addScore(15 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setTimeout(() => {
        nextPuzzle();
      }, 1000);
    } else {
      playHit();
      setTimeout(() => {
        initializeGame();
      }, 1500);
    }
  };

  const getColorName = (value: string) => {
    return colors.find(color => color.value === value)?.arabic || '';
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة الألوان</h3>
          <p className="text-gray-600 mb-4">
            اختر اللون الذي يطابق الاسم المعروض
          </p>
          
          {/* Target Color Name */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="text-2xl font-bold text-gray-800">
              {getColorName(targetColor)}
            </div>
          </div>
        </div>

        {/* Color Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((color, index) => (
            <Button
              key={index}
              onClick={() => handleColorClick(color)}
              className={`aspect-square text-white font-bold text-lg transition-all duration-300 ${
                showResult && color === targetColor 
                  ? 'ring-4 ring-green-400 transform scale-105' 
                  : showResult && color === selectedColor && color !== targetColor
                  ? 'ring-4 ring-red-400 transform scale-95'
                  : 'hover:transform hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              disabled={showResult}
            >
              {showResult && color === targetColor && '✓'}
              {showResult && color === selectedColor && color !== targetColor && '✗'}
            </Button>
          ))}
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="text-center">
            <div className={`text-lg font-bold ${
              selectedColor === targetColor ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedColor === targetColor ? 'أحسنت! 🎉' : 'حاول مرة أخرى 😊'}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="text-center mt-4">
          <div className="text-sm text-gray-600">
            المستوى: {level} | الصعوبة: {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </div>
        </div>
      </div>
    </Card>
  );
}
