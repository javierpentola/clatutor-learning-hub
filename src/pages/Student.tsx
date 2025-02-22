
import { ArrowLeft, BookOpen, Brain, HelpCircle, Shuffle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const translations = {
  en: {
    welcome: "Welcome, Student!",
    flashcards: "Flashcards",
    learn: "Learn",
    exam: "Exam",
    combine: "Combine"
  },
  es: {
    welcome: "¡Bienvenido, Estudiante!",
    flashcards: "Tarjetas de Memoria",
    learn: "Aprender",
    exam: "Examen",
    combine: "Combinar"
  },
  vi: {
    welcome: "Chào mừng, Học sinh!",
    flashcards: "Thẻ ghi nhớ",
    learn: "Học",
    exam: "Kiểm tra",
    combine: "Kết hợp"
  }
};

const Student = () => {
  const navigate = useNavigate();
  const { code } = useParams();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1a365d] mb-8">{t.welcome}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            className="bg-[#ea384c] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/flashcards/${code}`)}
          >
            <BookOpen className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">{t.flashcards}</span>
          </button>

          <button 
            className="bg-[#1a365d] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/learn/${code}`)}
          >
            <Brain className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">{t.learn}</span>
          </button>

          <button 
            className="bg-[#8E9196] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/exam-setup/${code}`)}
          >
            <HelpCircle className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">{t.exam}</span>
          </button>

          <button 
            className="bg-[#ea384c] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/combine/${code}`)}
          >
            <Shuffle className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">{t.combine}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Student;
