
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

interface MatchState {
  selected: string | null;
  matched: Set<string>;
  score: number;
}

const Combine = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [pairs, setPairs] = useState<QAPair[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    selected: null,
    matched: new Set(),
    score: 0,
  });

  useEffect(() => {
    if (!code) {
      toast({
        title: "Error",
        description: "No unit code provided",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    loadGame();
  }, [code]);

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
          title: "Error",
          description: "Unit not found",
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
          title: "No questions found",
          description: "This unit doesn't have any questions yet",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Found QA pairs:', qaData.length);

      // Crear o actualizar la sesión - usaremos un ID anónimo para estudiantes no registrados
      const { data: sessionData, error: sessionError } = await supabase
        .from('combine_game_sessions')
        .insert({
          unit_id: unitData.id,
          student_id: 'anonymous', // Usamos 'anonymous' en lugar de un UUID temporal
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
      
      // Shuffle questions and answers separately
      const shuffledQuestions = [...qaData].sort(() => Math.random() - 0.5).map(qa => qa.question);
      const shuffledAnswers = [...qaData].sort(() => Math.random() - 0.5).map(qa => qa.answer);
      
      setQuestions(shuffledQuestions);
      setAnswers(shuffledAnswers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Error",
        description: "Failed to load the game",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleItemClick = (item: string, isQuestion: boolean) => {
    if (matchState.matched.has(item)) return;

    if (!matchState.selected) {
      setMatchState({ ...matchState, selected: item });
      return;
    }

    // If clicking the same type (question-question or answer-answer), just update selection
    if ((isQuestion && questions.includes(matchState.selected)) ||
        (!isQuestion && answers.includes(matchState.selected))) {
      setMatchState({ ...matchState, selected: item });
      return;
    }

    // Check if it's a match
    const selectedPair = pairs.find(pair => 
      (pair.question === item && pair.answer === matchState.selected) ||
      (pair.answer === item && pair.question === matchState.selected)
    );

    if (selectedPair) {
      // It's a match!
      const newMatched = new Set(matchState.matched);
      newMatched.add(item);
      newMatched.add(matchState.selected);
      const newScore = matchState.score + 1;
      
      setMatchState({
        selected: null,
        matched: newMatched,
        score: newScore,
      });

      // Update session score
      if (sessionId) {
        supabase
          .from('combine_game_sessions')
          .update({ 
            score: newScore,
            completed: newScore === pairs.length,
            last_accessed: new Date().toISOString()
          })
          .eq('id', sessionId)
          .then(({ error }) => {
            if (error) console.error('Error updating score:', error);
          });
      }

      // Check if game is complete
      if (newScore === pairs.length) {
        toast({
          title: "Congratulations!",
          description: "You've matched all the pairs correctly!",
        });
      }
    } else {
      // Not a match
      setMatchState({ ...matchState, selected: null });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }

  if (pairs.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p>This unit doesn't have any questions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Matching Game</h1>
          <p className="text-lg text-gray-600">
            Match questions with their correct answers
          </p>
          <p className="text-xl font-medium mt-4">
            Score: {matchState.score} / {pairs.length}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Questions column */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            {questions.map((question, index) => (
              <div
                key={`q-${index}`}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  matchState.matched.has(question)
                    ? "bg-green-100 border-green-500"
                    : matchState.selected === question
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                } border shadow-sm`}
                onClick={() => handleItemClick(question, true)}
              >
                {question}
              </div>
            ))}
          </div>

          {/* Answers column */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Answers</h2>
            {answers.map((answer, index) => (
              <div
                key={`a-${index}`}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  matchState.matched.has(answer)
                    ? "bg-green-100 border-green-500"
                    : matchState.selected === answer
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                } border shadow-sm`}
                onClick={() => handleItemClick(answer, false)}
              >
                {answer}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Combine;
