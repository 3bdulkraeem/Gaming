import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { ArrowRight, Star } from "lucide-react";
import { Difficulty } from "@/lib/puzzleTypes";

export default function DifficultySelector() {
  const { selectDifficulty, backToMenu } = usePuzzleGame();

  const difficulties: Array<{
    level: Difficulty;
    name: string;
    description: string;
    color: string;
    stars: number;
  }> = [
    {
      level: 'easy',
      name: 'سهل',
      description: 'مناسب للمبتدئين',
      color: 'bg-green-500 hover:bg-green-600',
      stars: 1
    },
    {
      level: 'medium',
      name: 'متوسط',
      description: 'تحدي مناسب',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      stars: 2
    },
    {
      level: 'hard',
      name: 'صعب',
      description: 'للخبراء فقط',
      color: 'bg-red-500 hover:bg-red-600',
      stars: 3
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            اختر مستوى الصعوبة
          </CardTitle>
          <p className="text-gray-600">
            اختر المستوى الذي يناسبك
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {difficulties.map((diff) => (
            <Button
              key={diff.level}
              onClick={() => selectDifficulty(diff.level)}
              className={`w-full ${diff.color} text-white font-semibold py-4 text-lg group`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="text-right">
                    <div className="font-bold">{diff.name}</div>
                    <div className="text-sm opacity-90">{diff.description}</div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(diff.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            onClick={backToMenu}
            className="w-full mt-6"
          >
            العودة للقائمة الرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
