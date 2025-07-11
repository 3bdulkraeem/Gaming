import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Home, RotateCcw } from "lucide-react";

export default function GameUI() {
  const { 
    score, 
    timeLeft, 
    level, 
    difficulty, 
    currentPuzzleType,
    resetGame,
    backToMenu
  } = usePuzzleGame();

  const difficultyNames = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب'
  };

  const puzzleTypeNames = {
    memory: 'ذاكرة',
    color: 'ألوان',
    number: 'أرقام',
    pattern: 'أنماط',
    logic: 'منطق',
    speed: 'سرعة'
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-4">
      {/* Top Status Bar */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-lg">{score}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">{timeLeft}ث</span>
            </div>
            
            <div className="text-sm text-gray-600">
              المستوى: {level} | {difficultyNames[difficulty]}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {puzzleTypeNames[currentPuzzleType]}
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">تقدم المستوى</span>
            <span className="text-sm text-gray-600">{level}/10</span>
          </div>
          <Progress value={(level / 10) * 100} className="h-2" />
        </div>
      </Card>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetGame}
          className="bg-white/90 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          إعادة
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={backToMenu}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Home className="h-4 w-4 mr-1" />
          القائمة
        </Button>
      </div>
    </div>
  );
}
