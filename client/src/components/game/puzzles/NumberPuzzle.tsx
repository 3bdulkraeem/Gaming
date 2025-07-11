import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";
import { generateNumberPuzzle } from "@/lib/gameUtils";

export default function NumberPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [puzzle, setPuzzle] = useState<{
    question: string;
    answer: number;
    options?: number[];
    type: 'math' | 'sequence' | 'multiple';
  }>({ question: '', answer: 0, type: 'math' });
  
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const initializeGame = useCallback(() => {
    const newPuzzle = generateNumberPuzzle(difficulty, level);
    setPuzzle(newPuzzle);
    setUserAnswer('');
    setSelectedOption(null);
    setShowResult(false);
  }, [difficulty, level]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleSubmit = () => {
    if (showResult) return;
    
    let isCorrect = false;
    
    if (puzzle.type === 'multiple') {
      isCorrect = selectedOption === puzzle.answer;
    } else {
      const numAnswer = parseInt(userAnswer);
      isCorrect = numAnswer === puzzle.answer;
    }
    
    setShowResult(true);
    
    if (isCorrect) {
      playSuccess();
      addScore(20 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isAnswerProvided = puzzle.type === 'multiple' ? selectedOption !== null : userAnswer.trim() !== '';

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة الأرقام</h3>
          <p className="text-gray-600">
            حل المسألة الرياضية
          </p>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
          <div className="text-2xl font-bold text-gray-800 mb-4">
            {puzzle.question}
          </div>
          
          {/* Input Area */}
          {puzzle.type === 'multiple' && puzzle.options ? (
            <div className="grid grid-cols-2 gap-3">
              {puzzle.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`p-4 text-lg font-semibold transition-all duration-300 ${
                    selectedOption === option
                      ? 'bg-blue-500 text-white transform scale-105'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
                  } ${
                    showResult && option === puzzle.answer
                      ? 'ring-4 ring-green-400 bg-green-500 text-white'
                      : showResult && option === selectedOption && option !== puzzle.answer
                      ? 'ring-4 ring-red-400 bg-red-500 text-white'
                      : ''
                  }`}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب الإجابة"
                className="text-center text-xl font-bold w-32"
                disabled={showResult}
              />
              <span className="text-xl font-bold text-gray-600">=</span>
              <div className="text-xl font-bold text-gray-400">؟</div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center mb-4">
          <Button
            onClick={handleSubmit}
            disabled={!isAnswerProvided || showResult}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg"
          >
            تحقق من الإجابة
          </Button>
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="text-center">
            <div className={`text-lg font-bold mb-2 ${
              (puzzle.type === 'multiple' ? selectedOption === puzzle.answer : parseInt(userAnswer) === puzzle.answer)
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {(puzzle.type === 'multiple' ? selectedOption === puzzle.answer : parseInt(userAnswer) === puzzle.answer)
                ? 'إجابة صحيحة! 🎉' : `إجابة خاطئة 😊 الإجابة الصحيحة: ${puzzle.answer}`}
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
