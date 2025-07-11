import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import { useAudio } from "@/lib/stores/useAudio";

interface LogicPuzzle {
  type: 'sequence' | 'analogy' | 'classification';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function LogicPuzzle() {
  const { difficulty, addScore, nextPuzzle, level } = usePuzzleGame();
  const { playHit, playSuccess } = useAudio();
  
  const [puzzle, setPuzzle] = useState<LogicPuzzle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateLogicPuzzle = useCallback((): LogicPuzzle => {
    const puzzleTypes = ['sequence', 'analogy', 'classification'] as const;
    const type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
    
    switch (type) {
      case 'sequence':
        return generateSequencePuzzle();
      case 'analogy':
        return generateAnalogyPuzzle();
      case 'classification':
        return generateClassificationPuzzle();
      default:
        return generateSequencePuzzle();
    }
  }, [difficulty, level]);

  const generateSequencePuzzle = (): LogicPuzzle => {
    const sequences = [
      {
        question: "ما هو الرقم التالي في التسلسل: 2, 4, 8, 16, ؟",
        options: ["24", "32", "20", "18"],
        correctAnswer: 1,
        explanation: "كل رقم يضاعف الرقم السابق (2×2=4, 4×2=8, 8×2=16, 16×2=32)"
      },
      {
        question: "أكمل التسلسل: 1, 4, 9, 16, ؟",
        options: ["20", "24", "25", "30"],
        correctAnswer: 2,
        explanation: "مربعات الأرقام (1², 2², 3², 4², 5²=25)"
      },
      {
        question: "ما التالي: 3, 6, 12, 24, ؟",
        options: ["36", "48", "42", "50"],
        correctAnswer: 1,
        explanation: "كل رقم يضاعف الرقم السابق (3×2=6, 6×2=12, 12×2=24, 24×2=48)"
      }
    ];

    if (difficulty === 'hard') {
      sequences.push({
        question: "أكمل: 1, 1, 2, 3, 5, 8, ؟",
        options: ["11", "13", "15", "10"],
        correctAnswer: 1,
        explanation: "تسلسل فيبوناتشي (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13)"
      });
    }

    const randomIndex = Math.floor(Math.random() * sequences.length);
    return { ...sequences[randomIndex], type: 'sequence' };
  };

  const generateAnalogyPuzzle = (): LogicPuzzle => {
    const analogies = [
      {
        question: "قلم : كتابة = سكين : ؟",
        options: ["طبخ", "قطع", "مطبخ", "طعام"],
        correctAnswer: 1,
        explanation: "القلم يُستخدم للكتابة والسكين يُستخدم للقطع"
      },
      {
        question: "شمس : نهار = قمر : ؟",
        options: ["ظلام", "ليل", "نجوم", "سماء"],
        correctAnswer: 1,
        explanation: "الشمس تظهر في النهار والقمر يظهر في الليل"
      },
      {
        question: "عين : رؤية = أذن : ؟",
        options: ["صوت", "سمع", "موسيقى", "كلام"],
        correctAnswer: 1,
        explanation: "العين تُستخدم للرؤية والأذن تُستخدم للسمع"
      }
    ];

    if (difficulty === 'hard') {
      analogies.push({
        question: "طبيب : مرض = معلم : ؟",
        options: ["مدرسة", "طلاب", "جهل", "كتاب"],
        correctAnswer: 2,
        explanation: "الطبيب يعالج المرض والمعلم يعالج الجهل"
      });
    }

    const randomIndex = Math.floor(Math.random() * analogies.length);
    return { ...analogies[randomIndex], type: 'analogy' };
  };

  const generateClassificationPuzzle = (): LogicPuzzle => {
    const classifications = [
      {
        question: "أي من هذه الكلمات لا تنتمي للمجموعة؟",
        options: ["تفاح", "موز", "برتقال", "جزر"],
        correctAnswer: 3,
        explanation: "الجزر خضروات، بينما الباقي فواكه"
      },
      {
        question: "أي من هذه الأرقام مختلف؟",
        options: ["2", "4", "6", "9"],
        correctAnswer: 3,
        explanation: "9 رقم فردي، بينما الباقي أرقام زوجية"
      },
      {
        question: "أي من هذه الحيوانات مختلف؟",
        options: ["كلب", "قطة", "أسد", "سمكة"],
        correctAnswer: 3,
        explanation: "السمكة تعيش في الماء، بينما الباقي يعيش على اليابسة"
      }
    ];

    if (difficulty === 'hard') {
      classifications.push({
        question: "أي من هذه الكلمات مختلف؟",
        options: ["قمح", "أرز", "شعير", "حديد"],
        correctAnswer: 3,
        explanation: "الحديد معدن، بينما الباقي حبوب"
      });
    }

    const randomIndex = Math.floor(Math.random() * classifications.length);
    return { ...classifications[randomIndex], type: 'classification' };
  };

  const initializeGame = useCallback(() => {
    const newPuzzle = generateLogicPuzzle();
    setPuzzle(newPuzzle);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [generateLogicPuzzle]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (puzzle && answerIndex === puzzle.correctAnswer) {
      playSuccess();
      addScore(30 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setTimeout(() => {
        nextPuzzle();
      }, 2000);
    } else {
      playHit();
      setTimeout(() => {
        initializeGame();
      }, 3000);
    }
  };

  const getPuzzleTypeTitle = () => {
    if (!puzzle) return '';
    switch (puzzle.type) {
      case 'sequence': return 'تسلسل منطقي';
      case 'analogy': return 'قياس منطقي';
      case 'classification': return 'تصنيف منطقي';
      default: return 'منطق';
    }
  };

  if (!puzzle) return null;

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">لعبة المنطق</h3>
          <p className="text-gray-600 mb-2">
            {getPuzzleTypeTitle()}
          </p>
          <p className="text-sm text-gray-500">
            فكر جيداً واختر الإجابة الصحيحة
          </p>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-lg font-semibold text-gray-800 text-center">
            {puzzle.question}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {puzzle.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-right p-4 text-lg transition-all duration-300 ${
                selectedAnswer === index
                  ? showResult && index === puzzle.correctAnswer
                    ? 'bg-green-500 text-white ring-4 ring-green-300'
                    : showResult && index !== puzzle.correctAnswer
                    ? 'bg-red-500 text-white ring-4 ring-red-300'
                    : 'bg-blue-500 text-white'
                  : showResult && index === puzzle.correctAnswer
                  ? 'bg-green-500 text-white ring-4 ring-green-300'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300'
              }`}
              disabled={showResult}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
            </Button>
          ))}
        </div>

        {/* Result and Explanation */}
        {showResult && (
          <div className="text-center">
            <div className={`text-lg font-bold mb-3 ${
              selectedAnswer === puzzle.correctAnswer ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedAnswer === puzzle.correctAnswer ? 'إجابة صحيحة! 🎉' : 'إجابة خاطئة 😔'}
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
              <strong>التفسير:</strong> {puzzle.explanation}
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