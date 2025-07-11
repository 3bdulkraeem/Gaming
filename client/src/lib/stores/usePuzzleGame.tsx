import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Difficulty, PuzzleType } from "../puzzleTypes";
import { getLocalStorage, setLocalStorage } from "../utils";

interface HighScores {
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

interface PuzzleGameState {
  // Game state
  gamePhase: 'menu' | 'difficulty' | 'playing' | 'results';
  difficulty: Difficulty;
  currentPuzzleType: PuzzleType;
  
  // Game progress
  score: number;
  level: number;
  timeLeft: number;
  
  // High scores
  highScores: HighScores;
  isNewHighScore: boolean;
  
  // Actions
  startGame: () => void;
  selectDifficulty: (difficulty: Difficulty) => void;
  addScore: (points: number) => void;
  nextPuzzle: () => void;
  resetGame: () => void;
  restartGame: () => void;
  backToMenu: () => void;
  endGame: () => void;
  
  // Timer
  decrementTime: () => void;
}

const INITIAL_HIGH_SCORES: HighScores = {
  easy: 0,
  medium: 0,
  hard: 0,
  total: 0
};

const PUZZLE_TYPES: PuzzleType[] = ['memory', 'color', 'number', 'pattern', 'logic', 'speed'];

export const usePuzzleGame = create<PuzzleGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: 'menu',
    difficulty: 'easy',
    currentPuzzleType: 'memory',
    score: 0,
    level: 1,
    timeLeft: 30,
    highScores: getLocalStorage('puzzleHighScores') || INITIAL_HIGH_SCORES,
    isNewHighScore: false,
    
    // Actions
    startGame: () => {
      set({ gamePhase: 'difficulty' });
    },
    
    selectDifficulty: (difficulty: Difficulty) => {
      set({ 
        difficulty,
        gamePhase: 'playing',
        score: 0,
        level: 1,
        timeLeft: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25,
        currentPuzzleType: PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)],
        isNewHighScore: false
      });
    },
    
    addScore: (points: number) => {
      set((state) => ({ score: state.score + points }));
    },
    
    nextPuzzle: () => {
      set((state) => ({
        level: state.level + 1,
        currentPuzzleType: PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)],
        timeLeft: state.difficulty === 'easy' ? 45 : state.difficulty === 'medium' ? 35 : 25
      }));
      
      // Check if reached level 10
      if (get().level > 10) {
        get().endGame();
      }
    },
    
    resetGame: () => {
      const { difficulty } = get();
      set({
        score: 0,
        level: 1,
        timeLeft: difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25,
        currentPuzzleType: PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)],
        isNewHighScore: false
      });
    },
    
    restartGame: () => {
      set({ gamePhase: 'difficulty' });
    },
    
    backToMenu: () => {
      set({ gamePhase: 'menu' });
    },
    
    endGame: () => {
      const { score, difficulty, highScores } = get();
      
      // Check for new high score
      let newHighScores = { ...highScores };
      let isNewHighScore = false;
      
      if (score > highScores[difficulty]) {
        newHighScores[difficulty] = score;
        isNewHighScore = true;
      }
      
      // Update total high score
      newHighScores.total = Math.max(
        newHighScores.easy + newHighScores.medium + newHighScores.hard,
        highScores.total
      );
      
      // Save high scores
      setLocalStorage('puzzleHighScores', newHighScores);
      
      set({ 
        gamePhase: 'results',
        highScores: newHighScores,
        isNewHighScore
      });
    },
    
    decrementTime: () => {
      set((state) => {
        const newTimeLeft = state.timeLeft - 1;
        if (newTimeLeft <= 0) {
          // Time's up, end game
          setTimeout(() => get().endGame(), 100);
          return { timeLeft: 0 };
        }
        return { timeLeft: newTimeLeft };
      });
    }
  }))
);

// Timer effect
let timerInterval: NodeJS.Timeout | null = null;

usePuzzleGame.subscribe(
  (state) => state.gamePhase,
  (gamePhase) => {
    if (gamePhase === 'playing') {
      // Start timer
      timerInterval = setInterval(() => {
        usePuzzleGame.getState().decrementTime();
      }, 1000);
    } else {
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }
);
