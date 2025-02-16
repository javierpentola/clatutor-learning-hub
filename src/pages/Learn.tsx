
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Brain, Timer } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

const QuizGame = () => {
  const { code } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [options, setOptions] = useState<string[]>([]);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const generateOptions = (correctAnswer: string, allAnswers: string[]) => {
    const incorrectAnswers = allAnswers
      .filter((answer) => answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [...incorrectAnswers, correctAnswer].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);
  };

  const startGame = () => {
    if (!qaPairs || qaPairs.length === 0) {
      toast("No hay preguntas y respuestas disponibles para esta unidad");
      return;
    }
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    generateOptions(
      qaPairs[0].answer,
      qaPairs.map((qa) => qa.answer)
    );
    toast("¡Comienza el juego! Tienes 30 segundos por pregunta");
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (!qaPairs) return;

    const isCorrect = selectedAnswer === qaPairs[currentQuestion].answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 100);
      toast("¡Respuesta correcta! +100 puntos 🎯");
    } else {
      toast("Respuesta incorrecta 😢");
    }

    if (currentQuestion < qaPairs.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
      generateOptions(
        qaPairs[currentQuestion + 1].answer,
        qaPairs.map((qa) => qa.answer)
      );
    } else {
      handleGameOver();
    }
  };

  const handleTimeUp = () => {
    if (!qaPairs) return;
    
    toast("¡Se acabó el tiempo!");
    if (currentQuestion < qaPairs.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
      generateOptions(
        qaPairs[currentQuestion + 1].answer,
        qaPairs.map((qa) => qa.answer)
      );
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameStarted(false);
    toast(`¡Juego terminado! Puntuación final: ${score} puntos`);
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
          <h1 className="text-3xl font-bold">Quiz Game</h1>
          {!gameStarted && (
            <Button onClick={startGame} className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Comenzar Juego
            </Button>
          )}
        </div>

        {gameStarted && qaPairs && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold">
                Pregunta {currentQuestion + 1} de {qaPairs.length}
              </div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl mb-6">
                {qaPairs[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="p-4 text-left h-auto"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center text-2xl font-bold">
              Puntuación: {score}
            </div>
          </div>
        )}

        {!gameStarted && score > 0 && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Juego Terminado</h2>
            <p className="text-xl">Puntuación final: {score} puntos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
