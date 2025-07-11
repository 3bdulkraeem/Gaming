import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { Trophy, Star, Target, Clock, RotateCcw, Home } from "lucide-react";

export default function ResultsScreen() {
  const { 
    score, 
    level, 
    difficulty, 
    highScores, 
    isNewHighScore,
    restartGame,
    backToMenu
  } = usePuzzleGame();

  const difficultyNames = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب'
  };

  const getPerformanceMessage = () => {
    const percentage = (score / (level * 20)) * 100;
    if (percentage >= 90) return { message: 'أداء ممتاز! 🏆', color: 'text-yellow-600' };
    if (percentage >= 70) return { message: 'أداء جيد جداً! 🌟', color: 'text-green-600' };
    if (percentage >= 50) return { message: 'أداء جيد! 👍', color: 'text-blue-600' };
    return { message: 'يمكنك التحسن! 💪', color: 'text-gray-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            🎯 النتائج
          </CardTitle>
          <div className={`text-xl font-semibold ${performance.color}`}>
            {performance.message}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6" />
                <span className="text-lg font-semibold">النقاط النهائية</span>
              </div>
              <div className="text-4xl font-bold">{score}</div>
              {isNewHighScore && (
                <div className="text-sm mt-1 animate-pulse">
                  🎉 رقم قياسي جديد!
                </div>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600">المستوى</div>
              <div className="text-lg font-bold text-blue-600">{level}</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <Trophy className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600">الصعوبة</div>
              <div className="text-lg font-bold text-purple-600">{difficultyNames[difficulty]}</div>
            </div>
          </div>

          {/* High Scores */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">أفضل النقاط</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">سهل:</span>
                <span className="font-bold text-green-600">{highScores.easy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">متوسط:</span>
                <span className="font-bold text-yellow-600">{highScores.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">صعب:</span>
                <span className="font-bold text-red-600">{highScores.hard}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">الإجمالي:</span>
                  <span className="font-bold text-gray-800">{highScores.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={restartGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              لعب مرة أخرى
            </Button>
            
            <Button 
              variant="outline"
              onClick={backToMenu}
              className="w-full"
            >
              <Home className="mr-2 h-5 w-5" />
              العودة للقائمة الرئيسية
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
