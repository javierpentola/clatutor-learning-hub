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
    flipCard: "Flip Card",
    error: "Error Loading Flashcards",
    errorDesc: "There was a problem loading the flashcards. Please try again."
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
    flipCard: "Voltear tarjeta",
    error: "Error al cargar las tarjetas",
    errorDesc: "Hubo un problema al cargar las tarjetas. Por favor, inténtalo de nuevo."
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
    flipCard: "Lật thẻ",
    error: "Lỗi khi tải thẻ",
    errorDesc: "Đã xảy ra sự cố khi tải thẻ ghi nhớ. Vui lòng thử lại."
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
  const [error, setError] = useState<string | null>(null);
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
    if (!code) {
      setError("No unit code provided");
      setLoading(false);
      return;
    }
    
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching unit with code:", code);
        
        // First get the unit by code
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('id, title')
          .eq('code', code)
          .maybeSingle();

        if (unitError) {
          console.error('Error fetching unit:', unitError);
          setError("Failed to load unit");
          return;
        }

        if (!unitData) {
          console.error('No unit found with code:', code);
          setError("Unit not found");
          return;
        }

        console.log("Found unit:", unitData);

        // Get the questions and answers for this unit
        const { data: qaData, error: qaError } = await supabase
          .from('questions_answers')
          .select('id, question, answer')
          .eq('unit_id', unitData.id);

        if (qaError) {
          console.error('Error fetching questions:', qaError);
          setError("Failed to load flashcards");
          return;
        }

        console.log("Loaded QA data:", qaData?.length || 0, "cards");

        if (!qaData || qaData.length === 0) {
          setCards([]);
          return;
        }

        // Create the session
        const tempStudentId = crypto.randomUUID();
        const { error: sessionError } = await supabase
          .from('flashcard_sessions')
          .insert({
            unit_id: unitData.id,
            student_id: tempStudentId,
            total_cards: qaData.length,
            completed_cards: 0,
            last_accessed: new Date().toISOString(),
          });

        if (sessionError) {
          console.error('Error creating session:', sessionError);
          // Continue anyway as this is not critical
        }

        setCards(qaData);
      } catch (error) {
        console.error('Error loading flashcards:', error);
        setError("Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [code, toast]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen p-8">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.back}
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t.error}</h2>
          <p className="mb-4">{t.errorDesc}</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Show empty state
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
        <div className="text-center mb-4">
          <p className="text-lg font-medium">
            {t.card} {currentCardIndex + 1} {t.of} {cards.length}
          </p>
        </div>

        <div className="perspective-1000 relative h-[300px] mb-8 cursor-pointer select-none">
          <div
            className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={handleFlip}
          >
            <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
              <p className="text-2xl text-center">{cards[currentCardIndex].question}</p>
            </div>

            <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
              <p className="text-2xl text-center">{cards[currentCardIndex].answer}</p>
            </div>
          </div>
        </div>

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
