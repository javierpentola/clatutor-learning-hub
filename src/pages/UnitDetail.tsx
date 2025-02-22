
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

const translations = {
  en: {
    backToUnits: "Back to Units",
    addQA: "Add Question & Answer",
    addQADescription: "Add a new question and answer to this unit.",
    question: "Question",
    answer: "Answer",
    enterQuestion: "Enter the question",
    enterAnswer: "Enter the answer",
    cancel: "Cancel",
    add: "Add",
    loading: "Loading...",
    success: {
      qaAdded: "Question and answer added successfully",
      qaDeleted: "Question and answer deleted successfully"
    },
    error: {
      qaRequired: "Both question and answer are required",
      noUnit: "No unit found"
    }
  },
  es: {
    backToUnits: "Volver a Unidades",
    addQA: "Añadir Pregunta y Respuesta",
    addQADescription: "Añade una nueva pregunta y respuesta a esta unidad.",
    question: "Pregunta",
    answer: "Respuesta",
    enterQuestion: "Ingresa la pregunta",
    enterAnswer: "Ingresa la respuesta",
    cancel: "Cancelar",
    add: "Añadir",
    loading: "Cargando...",
    success: {
      qaAdded: "Pregunta y respuesta añadidas exitosamente",
      qaDeleted: "Pregunta y respuesta eliminadas exitosamente"
    },
    error: {
      qaRequired: "La pregunta y la respuesta son requeridas",
      noUnit: "No se encontró la unidad"
    }
  },
  vi: {
    backToUnits: "Quay lại Đơn vị",
    addQA: "Thêm Câu hỏi & Đáp án",
    addQADescription: "Thêm câu hỏi và đáp án mới cho đơn vị này.",
    question: "Câu hỏi",
    answer: "Đáp án",
    enterQuestion: "Nhập câu hỏi",
    enterAnswer: "Nhập đáp án",
    cancel: "Hủy",
    add: "Thêm",
    loading: "Đang tải...",
    success: {
      qaAdded: "Thêm câu hỏi và đáp án thành công",
      qaDeleted: "Xóa câu hỏi và đáp án thành công"
    },
    error: {
      qaRequired: "Cần có cả câu hỏi và đáp án",
      noUnit: "Không tìm thấy đơn vị"
    }
  }
};

type Unit = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  created_at: string;
};

type QuestionAnswer = {
  id: string;
  unit_id: string;
  question: string;
  answer: string;
  created_at: string;
};

const UnitDetail = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddQAOpen, setIsAddQAOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
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

  const { data: unit, isLoading } = useQuery({
    queryKey: ["unit", code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("code", code)
        .single();

      if (error) throw error;
      return data as Unit;
    },
  });

  const { data: questionsAnswers } = useQuery({
    queryKey: ["questions_answers", unit?.id],
    queryFn: async () => {
      if (!unit?.id) return [];
      
      const { data, error } = await supabase
        .from("questions_answers")
        .select("*")
        .eq("unit_id", unit.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as QuestionAnswer[];
    },
    enabled: !!unit?.id,
  });

  const addQuestionAnswer = useMutation({
    mutationFn: async () => {
      if (!unit?.id) throw new Error(t.error.noUnit);
      
      const { error } = await supabase.from("questions_answers").insert([
        {
          unit_id: unit.id,
          question,
          answer,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions_answers", unit?.id] });
      setIsAddQAOpen(false);
      setQuestion("");
      setAnswer("");
      toast({
        title: "Success",
        description: t.success.qaAdded,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteQuestionAnswer = useMutation({
    mutationFn: async (qaId: string) => {
      const { error } = await supabase
        .from("questions_answers")
        .delete()
        .eq("id", qaId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions_answers", unit?.id] });
      toast({
        title: "Success",
        description: t.success.qaDeleted,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddQA = () => {
    if (!question || !answer) {
      toast({
        title: "Error",
        description: t.error.qaRequired,
        variant: "destructive",
      });
      return;
    }
    addQuestionAnswer.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{t.loading}</div>
      </div>
    );
  }

  if (!unit) return null;

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate("/teacher")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.backToUnits}
      </Button>

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{unit.title}</h1>
            {unit.description && (
              <p className="text-muted-foreground">{unit.description}</p>
            )}
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-primary font-mono">{unit.code}</span>
          </div>
        </div>

        <Dialog open={isAddQAOpen} onOpenChange={setIsAddQAOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.addQA}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addQA}</DialogTitle>
              <DialogDescription>{t.addQADescription}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">{t.question}</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t.enterQuestion}
                />
              </div>
              <div>
                <Label htmlFor="answer">{t.answer}</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t.enterAnswer}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddQAOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleAddQA}>{t.add}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {questionsAnswers?.map((qa) => (
          <Card key={qa.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{t.question}</CardTitle>
                  <CardDescription className="mt-2">{qa.question}</CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteQuestionAnswer.mutate(qa.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h4 className="font-semibold mb-2">{t.answer}</h4>
                <p className="text-muted-foreground">{qa.answer}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UnitDetail;
