
interface GameItemProps {
  item: string;
  isMatched: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const GameItem = ({ item, isMatched, isSelected, onClick }: GameItemProps) => (
  <div
    className={`p-4 rounded-lg cursor-pointer transition-all duration-500 ${
      isMatched
        ? "opacity-0 pointer-events-none transform translate-y-2"
        : isSelected
        ? "bg-blue-100 border-blue-500"
        : "bg-white hover:bg-gray-50"
    } border shadow-sm`}
    onClick={onClick}
  >
    {item}
  </div>
);
