import { usePuzzleGame } from "@/lib/stores/usePuzzleGame";
import MemoryPuzzle from "./puzzles/MemoryPuzzle";
import ColorPuzzle from "./puzzles/ColorPuzzle";
import NumberPuzzle from "./puzzles/NumberPuzzle";
import PatternPuzzle from "./puzzles/PatternPuzzle";
import LogicPuzzle from "./puzzles/LogicPuzzle";
import SpeedPuzzle from "./puzzles/SpeedPuzzle";

export default function PuzzleGame() {
  const { currentPuzzleType } = usePuzzleGame();

  const renderPuzzle = () => {
    switch (currentPuzzleType) {
      case 'memory':
        return <MemoryPuzzle />;
      case 'color':
        return <ColorPuzzle />;
      case 'number':
        return <NumberPuzzle />;
      case 'pattern':
        return <PatternPuzzle />;
      case 'logic':
        return <LogicPuzzle />;
      case 'speed':
        return <SpeedPuzzle />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-32 pb-8">
      <div className="w-full max-w-lg mx-4">
        {renderPuzzle()}
      </div>
    </div>
  );
}
