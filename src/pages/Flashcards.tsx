
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

const Flashcards = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    loadFlashcards();
  }, [code]);

  const loadFlashcards = async () => {
    try {
      // First get the unit by code
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id, title')
        .eq('code', code)
        .single();

      if (unitError) throw unitError;
      if (!unitData) {
        toast({
          title: "Error",
          description: "Unit not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Get the questions and answers for this unit
      const { data: qaData, error: qaError } = await supabase
        .from('questions_answers')
        .select('id, question, answer')
        .eq('unit_id', unitData.id);

      if (qaError) throw qaError;
      if (!qaData || qaData.length === 0) {
        toast({
          title: "No flashcards found",
          description: "This unit doesn't have any flashcards yet",
          variant: "destructive",
        });
        return;
      }

      // Create or update the session
      const { data: sessionData, error: sessionError } = await supabase
        .from('flashcard_sessions')
        .upsert({
          unit_id: unitData.id,
          student_id: 'temporary-id', // This should be replaced with actual student ID when auth is implemented
          total_cards: qaData.length,
          completed_cards: 0,
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      
      setSessionId(sessionData.id);
      setCards(qaData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to load flashcards",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading flashcards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Flashcards Available</h2>
          <p>This unit doesn't have any flashcards yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="text-center mb-4">
          <p className="text-lg font-medium">
            Card {currentCardIndex + 1} of {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div 
          className="bg-white rounded-xl shadow-lg p-8 min-h-[300px] mb-8 cursor-pointer transition-all duration-300 transform hover:shadow-xl"
          onClick={handleFlip}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-center">
              {isFlipped ? cards[currentCardIndex].answer : cards[currentCardIndex].question}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleFlip} variant="secondary">
            Flip Card
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentCardIndex === cards.length - 1}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
