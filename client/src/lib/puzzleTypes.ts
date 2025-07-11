export type Difficulty = 'easy' | 'medium' | 'hard';

export type PuzzleType = 'memory' | 'color' | 'number' | 'pattern' | 'logic' | 'speed';

export interface PuzzleConfig {
  timeLimit: number;
  scoreMultiplier: number;
  maxLevel: number;
}

export const PUZZLE_CONFIGS: Record<Difficulty, PuzzleConfig> = {
  easy: {
    timeLimit: 45,
    scoreMultiplier: 1,
    maxLevel: 10
  },
  medium: {
    timeLimit: 35,
    scoreMultiplier: 2,
    maxLevel: 10
  },
  hard: {
    timeLimit: 25,
    scoreMultiplier: 3,
    maxLevel: 10
  }
};
