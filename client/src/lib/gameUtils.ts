export function generateMemorySequence(length: number): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 9));
  }
  return sequence;
}

export function generateColorPattern(colors: Array<{name: string, value: string, arabic: string}>, numOptions: number) {
  // Shuffle colors and take the required number
  const shuffled = [...colors].sort(() => Math.random() - 0.5);
  const selectedColors = shuffled.slice(0, numOptions);
  
  // Pick one as the target
  const target = selectedColors[Math.floor(Math.random() * selectedColors.length)];
  
  // Return target and options
  return {
    target: target.value,
    options: selectedColors.map(color => color.value)
  };
}

export function generateNumberPuzzle(difficulty: string, level: number) {
  const puzzleTypes = ['math', 'sequence', 'multiple'];
  const type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
  
  switch (type) {
    case 'math':
      return generateMathPuzzle(difficulty, level);
    case 'sequence':
      return generateSequencePuzzle(difficulty, level);
    case 'multiple':
      return generateMultiplePuzzle(difficulty, level);
    default:
      return generateMathPuzzle(difficulty, level);
  }
}

function generateMathPuzzle(difficulty: string, level: number) {
  const maxNum = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
  const operations = difficulty === 'easy' ? ['+', '-'] : ['+', '-', '*'];
  
  const a = Math.floor(Math.random() * maxNum) + 1;
  const b = Math.floor(Math.random() * maxNum) + 1;
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let question: string;
  let answer: number;
  
  switch (op) {
    case '+':
      question = `${a} + ${b}`;
      answer = a + b;
      break;
    case '-':
      question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
      answer = Math.max(a, b) - Math.min(a, b);
      break;
    case '*':
      const smallA = Math.floor(Math.random() * 12) + 1;
      const smallB = Math.floor(Math.random() * 12) + 1;
      question = `${smallA} × ${smallB}`;
      answer = smallA * smallB;
      break;
    default:
      question = `${a} + ${b}`;
      answer = a + b;
  }
  
  return {
    question,
    answer,
    type: 'math' as const
  };
}

function generateSequencePuzzle(difficulty: string, level: number) {
  const seqLength = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const step = Math.floor(Math.random() * 5) + 1;
  const start = Math.floor(Math.random() * 10) + 1;
  
  const sequence = [];
  for (let i = 0; i < seqLength; i++) {
    sequence.push(start + (i * step));
  }
  
  const answer = start + (seqLength * step);
  const question = `${sequence.join(', ')}, ?`;
  
  return {
    question,
    answer,
    type: 'sequence' as const
  };
}

function generateMultiplePuzzle(difficulty: string, level: number) {
  const maxNum = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200;
  
  // Generate a simple math problem
  const a = Math.floor(Math.random() * maxNum) + 1;
  const b = Math.floor(Math.random() * maxNum) + 1;
  const correctAnswer = a + b;
  
  // Generate wrong options
  const options = [correctAnswer];
  while (options.length < 4) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle options
  options.sort(() => Math.random() - 0.5);
  
  return {
    question: `${a} + ${b}`,
    answer: correctAnswer,
    options,
    type: 'multiple' as const
  };
}
