
import { GameItem } from "./GameItem";

interface GameColumnProps {
  title: string;
  items: string[];
  matchState: { selected: string | null; matched: Set<string> };
  onItemClick: (item: string) => void;
}

export const GameColumn = ({ title, items, matchState, onItemClick }: GameColumnProps) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {items.map((item, index) => (
      <GameItem
        key={`${title.toLowerCase()}-${index}`}
        item={item}
        isMatched={matchState.matched.has(item)}
        isSelected={matchState.selected === item}
        onClick={() => onItemClick(item)}
      />
    ))}
  </div>
);
