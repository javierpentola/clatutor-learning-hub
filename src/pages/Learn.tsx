
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gamepad } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: "question" | "answer";
  pairId: string;
}

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

const MemoryGame = () => {
  const { code } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const { data: qaPairs, isLoading } = useQuery({
    queryKey: ["qa_pairs", code],
    queryFn: async () => {
      const { data: unit, error: unitError } = await supabase
        .from("units")
        .select("id")
        .eq("code", code)
        .single();

      if (unitError) throw unitError;

      const { data: qaData, error: qaError } = await supabase
        .from("questions_answers")
        .select("id, question, answer")
        .eq("unit_id", unit.id);

      if (qaError) throw qaError;
      return qaData as QAPair[];
    },
    enabled: !!code,
  });

  const initializeGame = () => {
    if (!qaPairs || qaPairs.length === 0) {
      toast("No hay preguntas y respuestas disponibles para esta unidad");
      return;
    }

    const gameCards: Card[] = qaPairs.flatMap((pair, index) => [
      {
        id: index * 2,
        value: pair.question,
        isFlipped: false,
        isMatched: false,
        type: "question",
        pairId: pair.id,
      },
      {
        id: index * 2 + 1,
        value: pair.answer,
        isFlipped: false,
        isMatched: false,
        type: "answer",
        pairId: pair.id,
      },
    ]);

    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setMatches(0);
    setFlippedCards([]);
    toast("¡Nuevo juego iniciado! Encuentra las parejas de preguntas y respuestas");
  };

  useEffect(() => {
    if (qaPairs) {
      initializeGame();
    }
  }, [qaPairs]);

  const handleCardClick = (card: Card) => {
    if (isChecking || card.isMatched || flippedCards.length >= 2) return;

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

    const isMatch = first.pairId === second.pairId && first.type !== second.type;

    const newCards = cards.map((card) => {
      if (card.id === first.id || card.id === second.id) {
        if (isMatch) {
          // Si es una pareja correcta, las marcamos como matched y no se mostrarán
          return { ...card, isMatched: true, isFlipped: false };
        } else {
          // Si no son pareja, vuelven a ser azules
          return { ...card, isMatched: false, isFlipped: false };
        }
      }
      return card;
    });

    setCards(newCards);

    if (isMatch) {
      setMatches((prev) => prev + 1);
      if (matches + 1 === qaPairs?.length) {
        toast("¡Felicidades! ¡Has completado el juego! 🎉");
      } else {
        toast("¡Encontraste una pareja! 🎯");
      }
    }

    setFlippedCards([]);
    setIsChecking(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 flex items-center justify-center">
        <p className="text-xl">Cargando preguntas y respuestas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Juego de Memoria - Q&A</h1>
          <Button onClick={initializeGame} className="flex items-center gap-2">
            <Gamepad className="w-5 h-5" />
            Nuevo Juego
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            !card.isMatched && (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`aspect-[4/3] p-4 rounded-lg transition-all transform duration-300 flex items-center justify-center text-center ${
                  card.isFlipped
                    ? "bg-white shadow-lg scale-100"
                    : "bg-blue-500 shadow hover:bg-blue-600 scale-95"
                }`}
                disabled={isChecking}
              >
                {card.isFlipped && (
                  <span className="text-sm md:text-base">{card.value}</span>
                )}
              </button>
            )
          ))}
        </div>

        <div className="mt-6 text-center text-lg font-semibold">
          Parejas encontradas: {matches} de {qaPairs?.length || 0}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
