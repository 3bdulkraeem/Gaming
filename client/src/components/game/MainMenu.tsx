import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { Play, Trophy, Settings, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";

export default function MainMenu() {
  const { startGame, highScores } = usePuzzleGame();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            🧩 لعبة الألغاز
          </CardTitle>
          <p className="text-gray-600">
            اختبر ذكاءك مع ألغاز متنوعة ومثيرة
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={startGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
          >
            <Play className="mr-2 h-5 w-5" />
            ابدأ اللعب
          </Button>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={toggleMute}
              className="flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            </Button>
            
            <div className="flex items-center text-sm text-gray-600">
              <Trophy className="mr-1 h-4 w-4 text-yellow-500" />
              أعلى نقاط: {highScores.total}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>أنواع الألغاز المتاحة:</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🧠 ذاكرة</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🎨 ألوان</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🔢 أرقام</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">🔍 أنماط</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">🧩 منطق</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">⚡ سرعة</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
