import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { GameColumn } from "@/components/game/GameColumn";
import { useGameLogic } from "@/hooks/useGameLogic";
import { QAPair } from "@/types/game";

const translations = {
  en: {
    loading: "Loading game...",
    matchingGame: "Matching Game",
    matchDescription: "Match questions with their correct answers",
    score: "Score",
    noQuestions: "No Questions Available",
    noQuestionsYet: "This unit doesn't have any questions yet.",
    questions: "Questions",
    answers: "Answers",
    back: "Back",
    error: {
      title: "Error",
      noUnit: "No unit code provided",
      notFound: "Unit not found",
      loadFailed: "Failed to load the game"
    }
  },
  es: {
    loading: "Cargando juego...",
    matchingGame: "Juego de Emparejamiento",
    matchDescription: "Empareja las preguntas con sus respuestas correctas",
    score: "Puntuación",
    noQuestions: "No Hay Preguntas Disponibles",
    noQuestionsYet: "Esta unidad aún no tiene preguntas.",
    questions: "Preguntas",
    answers: "Respuestas",
    back: "Volver",
    error: {
      title: "Error",
      noUnit: "No se proporcionó código de unidad",
      notFound: "Unidad no encontrada",
      loadFailed: "Error al cargar el juego"
    }
  },
  vi: {
    loading: "Đang tải trò chơi...",
    matchingGame: "Trò chơi ghép đôi",
    matchDescription: "Ghép câu hỏi với câu trả lời đúng",
    score: "Điểm số",
    noQuestions: "Không có câu hỏi",
    noQuestionsYet: "Đơn vị này chưa có câu hỏi nào.",
    questions: "Câu hỏi",
    answers: "Câu trả lời",
    back: "Quay lại",
    error: {
      title: "Lỗi",
      noUnit: "Không có mã đơn vị",
      notFound: "Không tìm thấy đơn vị",
      loadFailed: "Không thể tải trò chơi"
    }
  }
};

const Combine = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [pairs, setPairs] = useState<QAPair[]>([]);
  const [language, setLanguage] = useState("en");

  const { matchState, setSessionId, handleItemClick } = useGameLogic(pairs);

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

  useEffect(() => {
    if (!code) {
      toast({
        title: t.error.title,
        description: t.error.noUnit,
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    loadGame();
  }, [code, language]);

  const loadGame = async () => {
    try {
      console.log("Loading game for code:", code);
      
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id, title')
        .eq('code', code)
        .maybeSingle();

      if (unitError) {
        console.error('Unit error:', unitError);
        throw unitError;
      }
      
      if (!unitData) {
        console.log('No unit found for code:', code);
        toast({
          title: t.error.title,
          description: t.error.notFound,
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      console.log('Found unit:', unitData);

      const { data: qaData, error: qaError } = await supabase
        .from('questions_answers')
        .select('id, question, answer')
        .eq('unit_id', unitData.id);

      if (qaError) {
        console.error('QA error:', qaError);
        throw qaError;
      }
      
      if (!qaData || qaData.length === 0) {
        console.log('No questions found for unit:', unitData.id);
        toast({
          title: t.error.title,
          description: t.error.loadFailed,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Found QA pairs:', qaData.length);

      const anonymousUuid = crypto.randomUUID();
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('combine_game_sessions')
        .insert({
          unit_id: unitData.id,
          student_id: anonymousUuid,
          max_score: qaData.length,
          score: 0,
          completed: false,
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      setSessionId(sessionData.id);
      setPairs(qaData);
      
      const shuffledQuestions = [...qaData].sort(() => Math.random() - 0.5).map(qa => qa.question);
      const shuffledAnswers = [...qaData].sort(() => Math.random() - 0.5).map(qa => qa.answer);
      
      setQuestions(shuffledQuestions);
      setAnswers(shuffledAnswers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: t.error.title,
        description: t.error.loadFailed,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }

  if (pairs.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.noQuestions}</h2>
          <p>{t.noQuestionsYet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.matchingGame}</h1>
          <p className="text-lg text-gray-600">
            {t.matchDescription}
          </p>
          <p className="text-xl font-medium mt-4">
            {t.score}: {matchState.score} / {pairs.length}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <GameColumn
            title={t.questions}
            items={questions}
            matchState={matchState}
            onItemClick={(item) => handleItemClick(item, true, questions, answers)}
          />
          <GameColumn
            title={t.answers}
            items={answers}
            matchState={matchState}
            onItemClick={(item) => handleItemClick(item, false, questions, answers)}
          />
        </div>
      </div>
    </div>
  );
};

export default Combine;
