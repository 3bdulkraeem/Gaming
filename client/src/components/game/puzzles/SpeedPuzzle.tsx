import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";

interface SpeedChallenge {
  type: 'reaction' | 'counting' | 'matching';
  question: string;
  correctAnswer: any;
  timeLimit: number;
}

export default function SpeedPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [challenge, setChallenge] = useState<SpeedChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'challenge' | 'result'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [matchingTarget, setMatchingTarget] = useState<string>('');
  const [matchingOptions, setMatchingOptions] = useState<string[]>([]);
  
  const startTime = useRef<number>(0);
  const challengeTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const generateSpeedChallenge = useCallback((): SpeedChallenge => {
    const challengeTypes = ['reaction', 'counting', 'matching'] as const;
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    const baseTime = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2;
    
    switch (type) {
      case 'reaction':
        return {
          type: 'reaction',
          question: 'اضغط بسرعة عندما يظهر الزر الأخضر!',
          correctAnswer: 'click',
          timeLimit: baseTime
        };
      case 'counting':
        const count = Math.floor(Math.random() * 10) + 5;
        const shapes = ['●', '■', '▲', '♦'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        return {
          type: 'counting',
          question: `احسب عدد ${shape}: ${shape.repeat(count)}`,
          correctAnswer: count,
          timeLimit: baseTime + 2
        };
      case 'matching':
        const colors = ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'بنفسجي'];
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const options = [...colors].sort(() => Math.random() - 0.5);
        setMatchingTarget(targetColor);
        setMatchingOptions(options);
        return {
          type: 'matching',
          question: `اختر: ${targetColor}`,
          correctAnswer: targetColor,
          timeLimit: baseTime + 1
        };
      default:
        return {
          type: 'reaction',
          question: 'اضغط بسرعة!',
          correctAnswer: 'click',
          timeLimit: baseTime
        };
    }
  }, [difficulty]);

  const initializeGame = useCallback(() => {
    const newChallenge = generateSpeedChallenge();
    setChallenge(newChallenge);
    setUserAnswer('');
    setShowChallenge(false);
    setReactionTime(null);
    setGamePhase('waiting');
    
    // Start challenge after random delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    setTimeout(() => {
      setShowChallenge(true);
      setGamePhase('challenge');
      setTimeLeft(newChallenge.timeLimit);
      startTime.current = Date.now();
      
      // Start countdown
      countdownInterval.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, delay);
  }, [generateSpeedChallenge]);

  const handleTimeout = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setGamePhase('result');
    playHit();
    setTimeout(() => {
      initializeGame();
    }, 2000);
  };

  const handleReactionClick = () => {
    if (!challenge || gamePhase !== 'challenge' || challenge.type !== 'reaction') return;
    
    const reactionTimeMs = Date.now() - startTime.current;
    setReactionTime(reactionTimeMs);
    
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    
    setGamePhase('result');
    
    // Score based on reaction time
    let score = 0;
    if (reactionTimeMs < 500) score = 50;
    else if (reactionTimeMs < 1000) score = 30;
    else if (reactionTimeMs < 1500) score = 20;
    else score = 10;
    
    score *= (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
    
    playSuccess();
    addScore(score);
    
    setTimeout(() => {
      nextPuzzle();
    }, 2000);
  };

  const handleCountingSubmit = () => {
    if (!challenge || gamePhase !== 'challenge' || challenge.type !== 'counting') return;
    
    const answer = parseInt(userAnswer);
    
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    
    setGamePhase('result');
    
    if (answer === challenge.correctAnswer) {
      playSuccess();
      const timeBonus = Math.max(0, timeLeft * 5);
      const score = (25 + timeBonus) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
      addScore(score);
      
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

  const handleMatchingSelect = (option: string) => {
    if (!challenge || gamePhase !== 'challenge' || challenge.type !== 'matching') return;
    
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    
    setGamePhase('result');
    
    if (option === challenge.correctAnswer) {
      playSuccess();
      const timeBonus = Math.max(0, timeLeft * 3);
      const score = (20 + timeBonus) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
      addScore(score);
      
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

  useEffect(() => {
    initializeGame();
    return () => {
      if (challengeTimeout.current) clearTimeout(challengeTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [initializeGame]);

  const renderChallenge = () => {
    if (!challenge) return null;
    
    switch (challenge.type) {
      case 'reaction':
        return (
          <div className="text-center">
            {gamePhase === 'waiting' && (
              <div className="text-lg text-gray-600 mb-4">
                استعد... انتظر الإشارة الخضراء
              </div>
            )}
            {gamePhase === 'challenge' && (
              <Button
                onClick={handleReactionClick}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-8 px-12 text-2xl animate-pulse"
              >
                اضغط الآن!
              </Button>
            )}
            {gamePhase === 'result' && reactionTime && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 mb-2">
                  وقت الاستجابة: {reactionTime}ms
                </div>
                <div className="text-sm text-gray-600">
                  {reactionTime < 500 ? 'سريع جداً! 🚀' : 
                   reactionTime < 1000 ? 'جيد! 👍' : 
                   reactionTime < 1500 ? 'لا بأس 😊' : 'يمكنك التحسن 💪'}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'counting':
        return (
          <div className="text-center">
            <div className="text-lg mb-4 font-mono text-2xl">
              {challenge.question}
            </div>
            {gamePhase === 'challenge' && (
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="border-2 border-gray-300 rounded px-3 py-2 text-center text-lg font-bold w-20"
                  placeholder="؟"
                  autoFocus
                />
                <Button
                  onClick={handleCountingSubmit}
                  disabled={!userAnswer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2"
                >
                  إرسال
                </Button>
              </div>
            )}
            {gamePhase === 'result' && (
              <div className="text-lg font-bold">
                {parseInt(userAnswer) === challenge.correctAnswer ? 
                  'إجابة صحيحة! 🎉' : 
                  `إجابة خاطئة. الإجابة الصحيحة: ${challenge.correctAnswer}`}
              </div>
            )}
          </div>
        );
        
      case 'matching':
        return (
          <div className="text-center">
            <div className="text-lg mb-4 font-bold">
              {challenge.question}
            </div>
            {gamePhase === 'challenge' && (
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                {matchingOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleMatchingSelect(option)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            {gamePhase === 'result' && (
              <div className="text-lg font-bold">
                {userAnswer === challenge.correctAnswer ? 
                  'إجابة صحيحة! 🎉' : 
                  `إجابة خاطئة. الإجابة الصحيحة: ${challenge.correctAnswer}`}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const getChallengeTitle = () => {
    if (!challenge) return '';
    switch (challenge.type) {
      case 'reaction': return 'تحدي سرعة الاستجابة';
      case 'counting': return 'تحدي العد السريع';
      case 'matching': return 'تحدي المطابقة السريعة';
      default: return 'تحدي السرعة';
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة السرعة</h3>
          <p className="text-gray-600 mb-2">
            {getChallengeTitle()}
          </p>
          {gamePhase === 'challenge' && (
            <div className="text-red-600 font-bold text-lg">
              ⏱️ {timeLeft}ث
            </div>
          )}
        </div>

        <div className="min-h-[200px] flex items-center justify-center">
          {renderChallenge()}
        </div>

        {/* Progress Info */}
        <div className="text-center mt-4">
          <div className="text-sm text-gray-600">
            المستوى: {level} | الصعوبة: {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </div>
        </div>
      </div>
    </Card>
  );
}