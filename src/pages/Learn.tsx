
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gamepad } from "lucide-react";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const emojis = ["🎨", "📚", "🎭", "🎮", "🎵", "🎪", "🎯", "🎲"];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setMatches(0);
    setFlippedCards([]);
    toast("¡Nuevo juego iniciado!");
  };

  const handleCardClick = (card: Card) => {
    if (isChecking || card.isMatched || card.isFlipped || flippedCards.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setTimeout(checkMatch, 1000);
    }
  };

  const checkMatch = () => {
    const [first, second] = flippedCards;
    if (first.value === second.value) {
      const newCards = cards.map((card) =>
        card.id === first.id || card.id === second.id
          ? { ...card, isMatched: true }
          : card
      );
      setCards(newCards);
      setMatches(matches + 1);
      if (matches + 1 === emojis.length) {
        toast("¡Felicidades! ¡Has completado el juego! 🎉");
      } else {
        toast("¡Encontraste una pareja! 🎯");
      }
    } else {
      const newCards = cards.map((card) =>
        card.id === first.id || card.id === second.id
          ? { ...card, isFlipped: false }
          : card
      );
      setCards(newCards);
    }
    setFlippedCards([]);
    setIsChecking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Juego de Memoria</h1>
          <Button onClick={initializeGame} className="flex items-center gap-2">
            <Gamepad className="w-5 h-5" />
            Nuevo Juego
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`aspect-square text-4xl p-4 rounded-lg transition-all transform duration-300 ${
                card.isFlipped || card.isMatched
                  ? "bg-white shadow-lg scale-100"
                  : "bg-blue-500 shadow hover:bg-blue-600 scale-95"
              }`}
              disabled={isChecking}
            >
              {(card.isFlipped || card.isMatched) && card.value}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-lg font-semibold">
          Parejas encontradas: {matches} de {emojis.length}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
