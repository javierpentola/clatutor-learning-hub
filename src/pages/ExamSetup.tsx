import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionType = 
  | "multiple_choice" 
  | "true_false" 
  | "written";

const translations = {
  en: {
    examSetup: "Exam Setup",
    selectTypes: "Select Question Types",
    description: "Choose the types of questions you want in your exam. Each type offers different ways to test knowledge and understanding.",
    multipleChoice: "Multiple Choice Questions",
    trueFalse: "True/False Questions",
    written: "Written Questions",
    startExam: "Start Exam",
    settingUp: "Setting up exam...",
    back: "Back",
    errors: {
      noTypes: "Please select at least one question type",
      noQuestions: "This unit has no questions available",
      loadError: "Error loading unit data",
      examError: "Error creating exam session",
      noUnit: "Unit not found"
    },
    loading: "Loading..."
  },
  es: {
    examSetup: "Configuración del Examen",
    selectTypes: "Seleccionar Tipos de Preguntas",
    description: "Elige los tipos de preguntas que deseas en tu examen. Cada tipo ofrece diferentes formas de evaluar el conocimiento y la comprensión.",
    multipleChoice: "Preguntas de Opción Múltiple",
    trueFalse: "Preguntas Verdadero/Falso",
    written: "Preguntas Escritas",
    startExam: "Comenzar Examen",
    settingUp: "Preparando examen...",
    back: "Volver",
    errors: {
      noTypes: "Por favor selecciona al menos un tipo de pregunta",
      noQuestions: "Esta unidad no tiene preguntas disponibles",
      loadError: "Error al cargar los datos de la unidad",
      examError: "Error al crear la sesión del examen",
      noUnit: "Unidad no encontrada"
    },
    loading: "Cargando..."
  },
  vi: {
    examSetup: "Thiết lập Bài kiểm tra",
    selectTypes: "Chọn Loại Câu hỏi",
    description: "Chọn loại câu hỏi bạn muốn trong bài kiểm tra. Mỗi loại cung cấp các cách khác nhau để kiểm tra kiến thức và hiểu biết.",
    multipleChoice: "Câu hỏi Trắc nghiệm",
    trueFalse: "Câu hỏi Đúng/Sai",
    written: "Câu hỏi Tự luận",
    startExam: "Bắt đầu Kiểm tra",
    settingUp: "Đang thiết lập bài kiểm tra...",
    back: "Quay lại",
    errors: {
      noTypes: "Vui lòng chọn ít nhất một loại câu hỏi",
      noQuestions: "Đơn vị này không có câu hỏi",
      loadError: "Lỗi khi tải dữ liệu đơn vị",
      examError: "Lỗi khi tạo phiên kiểm tra",
      noUnit: "Không tìm thấy đơn vị"
    },
    loading: "Đang tải..."
  }
};

const ExamSetup = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasQuestions, setHasQuestions] = useState(false);
  const [language, setLanguage] = useState("en");
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const checkQuestions = async () => {
      try {
        const { data: unitData, error: unitError } = await supabase
          .from('units')
          .select('id')
          .eq('code', code)
          .single();

        if (unitError) throw unitError;

        const { count, error: questionsError } = await supabase
          .from('questions_answers')
          .select('*', { count: 'exact', head: true })
          .eq('unit_id', unitData.id);

        if (questionsError) throw questionsError;

        const questionCount = count || 0;
        setHasQuestions(questionCount > 0);
        setTotalQuestions(questionCount);
      } catch (error: any) {
        toast({
          title: translations[language as keyof typeof translations].errors.loadError,
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    checkQuestions();

    const currentLang = localStorage.getItem("language") || "en";
    setLanguage(currentLang);

    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, [code, toast]);

  const questionTypes = [
    { id: "multiple_choice", label: translations[language as keyof typeof translations].multipleChoice },
    { id: "true_false", label: translations[language as keyof typeof translations].trueFalse },
    { id: "written", label: translations[language as keyof typeof translations].written },
  ] as const;

  const handleTypeToggle = (type: QuestionType) => {
    setSelectedTypes(current =>
      current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
    );
  };

  const startExam = async () => {
    const t = translations[language as keyof typeof translations];

    if (!hasQuestions || totalQuestions === 0) {
      toast({
        title: "Error",
        description: t.errors.noQuestions,
        variant: "destructive",
      });
      return;
    }

    if (selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: t.errors.noTypes,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id, title, code')
        .eq('code', code)
        .single();

      if (unitError) throw unitError;

      if (!unitData) {
        toast({
          title: "Error",
          description: t.errors.noUnit,
          variant: "destructive",
        });
        return;
      }

      const tempStudentId = crypto.randomUUID();
      const { data: sessionData, error: sessionError } = await supabase
        .from('exam_sessions')
        .insert({
          unit_id: unitData.id,
          student_id: tempStudentId,
          question_types: selectedTypes,
          unit_title: unitData.title,
          unit_code: unitData.code,
          num_questions: Math.min(10, totalQuestions)
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      navigate(`/exam/${sessionData.id}`);
    } catch (error: any) {
      toast({
        title: t.errors.examError,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const t = translations[language as keyof typeof translations];

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.examSetup}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t.selectTypes}</h2>
          <p className="text-gray-600 mb-6">
            {t.description}
          </p>

          <div className="space-y-4">
            {questionTypes.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={selectedTypes.includes(id as QuestionType)}
                  onCheckedChange={() => handleTypeToggle(id as QuestionType)}
                  disabled={!hasQuestions || totalQuestions === 0}
                />
                <Label htmlFor={id} className="text-base">{label}</Label>
              </div>
            ))}
          </div>

          <Button
            className="mt-8 w-full"
            onClick={startExam}
            disabled={loading || selectedTypes.length === 0 || !hasQuestions || totalQuestions === 0}
          >
            {loading ? t.settingUp : t.startExam}
          </Button>

          {(!hasQuestions || totalQuestions === 0) && (
            <p className="mt-4 text-red-500 text-center">
              {t.errors.noQuestions}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
