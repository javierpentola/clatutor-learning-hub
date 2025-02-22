import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Brain, Timer, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

const translations = {
  en: {
    loading: "Loading questions and answers...",
    quizGame: "Quiz Game",
    startGame: "Start Game",
    question: "Question",
    of: "of",
    score: "Score",
    gameOver: "Game Over",
    finalScore: "Final score",
    points: "points",
    gameStart: "Game starts! You have 30 seconds per question",
    correctAnswer: "Correct answer! +100 points 🎯",
    wrongAnswer: "Wrong answer 😢",
    timeUp: "Time's up!",
    back: "Back",
    noQuestions: "No questions available",
    noQuestionsYet: "This unit doesn't have any questions yet.",
    loadError: "Failed to load questions"
  },
  es: {
    loading: "Cargando preguntas y respuestas...",
    quizGame: "Juego de Preguntas",
    startGame: "Comenzar Juego",
    question: "Pregunta",
    of: "de",
    score: "Puntuación",
    gameOver: "Juego Terminado",
    finalScore: "Puntuación final",
    points: "puntos",
    gameStart: "¡Comienza el juego! Tienes 30 segundos por pregunta",
    correctAnswer: "¡Respuesta correcta! +100 puntos 🎯",
    wrongAnswer: "Respuesta incorrecta 😢",
    timeUp: "¡Se acabó el tiempo!",
    back: "Volver",
    noQuestions: "No hay preguntas disponibles",
    noQuestionsYet: "Esta unidad aún no tiene preguntas.",
    loadError: "Error al cargar las preguntas"
  },
  vi: {
    loading: "Đang tải câu hỏi và câu trả lời...",
    quizGame: "Trò chơi câu đố",
    startGame: "Bắt đầu trò chơi",
    question: "Câu hỏi",
    of: "của",
    score: "Điểm số",
    gameOver: "Trò chơi kết thúc",
    finalScore: "Điểm số cuối cùng",
    points: "điểm",
    gameStart: "Trò chơi bắt đầu! Bạn có 30 giây cho mỗi câu hỏi",
    correctAnswer: "Câu trả lời đúng! +100 điểm 🎯",
    wrongAnswer: "Câu trả lời sai 😢",
    timeUp: "Hết giờ!",
    back: "Quay lại",
    noQuestions: "Không có câu hỏi",
    noQuestionsYet: "Đơn vị này chưa có câu hỏi nào.",
    loadError: "Không thể tải câu hỏi"
  }
};

const QuizGame = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [options, setOptions] = useState<string[]>([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };

    handleLanguageChange();
    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const t = translations[language as keyof typeof translations];

  const { data: qaPairs, isLoading } = useQuery({
    queryKey: ["qa_pairs", code],
    queryFn: async () => {
      if (!code) throw new Error("No unit code provided");

      const { data: unit, error: unitError } = await supabase
        .from("units")
        .select("id")
        .eq("code", code)
        .single();

      if (unitError) {
        console.error("Error fetching unit:", unitError);
        throw unitError;
      }

      if (!unit) {
        throw new Error("Unit not found");
      }

      console.log("Found unit:", unit);

      const { data: qaData, error: qaError } = await supabase
        .from("questions_answers")
        .select("id, question, answer")
        .eq("unit_id", unit.id);

      if (qaError) {
        console.error("Error fetching QA pairs:", qaError);
        throw qaError;
      }

      console.log("Loaded QA pairs:", qaData?.length || 0);

      if (!qaData || qaData.length === 0) {
        throw new Error("No questions available");
      }

      return qaData as QAPair[];
    },
    enabled: !!code,
    retry: false,
    meta: {
      errorMessage: "Failed to load questions"
    }
  });

  useEffect(() => {
    const handleError = async (error: Error) => {
      toast(error.message || "Failed to load questions");
      if (error.message === "Unit not found") {
        navigate("/");
      }
    };

    if (isLoading) return;

    if (!qaPairs && !isLoading) {
      handleError(new Error("Failed to load questions"));
    }
  }, [qaPairs, isLoading, navigate]);

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
      toast(t.noQuestionsYet);
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
    toast(t.gameStart);
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (!qaPairs) return;

    const isCorrect = selectedAnswer === qaPairs[currentQuestion].answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 100);
      toast(t.correctAnswer);
    } else {
      toast(t.wrongAnswer);
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
    
    toast(t.timeUp);
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
    toast(`${t.gameOver}! ${t.finalScore}: ${score} ${t.points}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 flex items-center justify-center">
        <p className="text-xl">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-6 md:p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-left">{t.quizGame}</h1>
          {!gameStarted && (
            <Button onClick={startGame} className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" />
              {t.startGame}
            </Button>
          )}
        </div>

        {gameStarted && qaPairs && (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 p-4 rounded-lg">
              <div className="text-lg md:text-xl font-semibold text-center sm:text-left">
                {t.question} {currentQuestion + 1} {t.of} {qaPairs.length}
              </div>
              <div className="flex items-center gap-2 text-lg md:text-xl font-semibold">
                <Timer className="w-5 h-5" />
                {timeLeft}s
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl mb-4 md:mb-6 text-center sm:text-left">
                {qaPairs[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="p-4 text-left h-auto text-sm md:text-base break-words min-h-[60px] transition-all hover:scale-[1.02]"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center text-xl md:text-2xl font-bold bg-white/50 p-4 rounded-lg">
              {t.score}: {score}
            </div>
          </div>
        )}

        {!gameStarted && score > 0 && (
          <div className="text-center mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4">{t.gameOver}</h2>
            <p className="text-lg md:text-xl">
              {t.finalScore}: {score} {t.points}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
