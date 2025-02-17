
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QAPair, MatchState } from "@/types/game";

export const useGameLogic = (pairs: QAPair[]) => {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    selected: null,
    matched: new Set(),
    score: 0,
  });

  const handleItemClick = (item: string, isQuestion: boolean, questions: string[], answers: string[]) => {
    if (matchState.matched.has(item)) return;

    if (!matchState.selected) {
      setMatchState({ ...matchState, selected: item });
      return;
    }

    if ((isQuestion && questions.includes(matchState.selected)) ||
        (!isQuestion && answers.includes(matchState.selected))) {
      setMatchState({ ...matchState, selected: item });
      return;
    }

    const selectedPair = pairs.find(pair => 
      (pair.question === item && pair.answer === matchState.selected) ||
      (pair.answer === item && pair.question === matchState.selected)
    );

    if (selectedPair) {
      const newMatched = new Set(matchState.matched);
      newMatched.add(item);
      newMatched.add(matchState.selected);
      const newScore = matchState.score + 1;
      
      setMatchState({
        selected: null,
        matched: newMatched,
        score: newScore,
      });

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

      if (newScore === pairs.length) {
        toast({
          title: "Congratulations!",
          description: "You've matched all the pairs correctly!",
        });
      }
    } else {
      setMatchState({ ...matchState, selected: null });
    }
  };

  return {
    matchState,
    setSessionId,
    handleItemClick,
  };
};
