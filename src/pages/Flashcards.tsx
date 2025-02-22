
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const translations = {
  en: {
    loading: "Loading flashcards...",
    noFlashcards: "No Flashcards Available",
    noFlashcardsDesc: "This unit doesn't have any flashcards yet.",
    back: "Back",
    card: "Card",
    of: "of",
    previous: "Previous",
    next: "Next",
    flipCard: "Flip Card"
  },
  es: {
    loading: "Cargando tarjetas de memoria...",
    noFlashcards: "No hay tarjetas disponibles",
    noFlashcardsDesc: "Esta unidad aún no tiene tarjetas de memoria.",
    back: "Volver",
    card: "Tarjeta",
    of: "de",
    previous: "Anterior",
    next: "Siguiente",
    flipCard: "Voltear tarjeta"
  },
  vi: {
    loading: "Đang tải thẻ ghi nhớ...",
    noFlashcards: "Không có thẻ ghi nhớ",
    noFlashcardsDesc: "Đơn vị này chưa có thẻ ghi nhớ nào.",
    back: "Quay lại",
    card: "Thẻ",
    of: "trong số",
    previous: "Trước",
    next: "Tiếp theo",
    flipCard: "Lật thẻ"
  }
};

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

  useEffect(() => {
    if (!code) return;
    loadFlashcards();
  }, [code]);

  const loadFlashcards = async () => {
    try {
      // First get the unit by code, using maybeSingle() instead of single()
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id, title')
        .eq('code', code)
        .maybeSingle();

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

      // Create or update the session - using a generated UUID for student_id temporarily
      const tempStudentId = crypto.randomUUID();
      const { data: sessionData, error: sessionError } = await supabase
        .from('flashcard_sessions')
        .upsert({
          unit_id: unitData.id,
          student_id: tempStudentId,
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

  const t = translations[language as keyof typeof translations];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.noFlashcards}</h2>
          <p>{t.noFlashcardsDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
      </Button>

      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="text-center mb-4">
          <p className="text-lg font-medium">
            {t.card} {currentCardIndex + 1} {t.of} {cards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 relative h-[300px] mb-8 cursor-pointer select-none">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
              <p className="text-2xl text-center">{cards[currentCardIndex].question}</p>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
              <p className="text-2xl text-center">{cards[currentCardIndex].answer}</p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> {t.previous}
          </Button>
          <Button onClick={handleFlip} variant="secondary">
            {t.flipCard}
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentCardIndex === cards.length - 1}
          >
            {t.next} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
