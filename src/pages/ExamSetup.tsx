
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionType = "multiple_choice" | "true_false" | "open_ended";

const ExamSetup = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);

  const questionTypes = [
    { id: "multiple_choice", label: "Multiple Choice" },
    { id: "true_false", label: "True/False" },
    { id: "open_ended", label: "Open Ended" },
  ] as const;

  const handleTypeToggle = (type: QuestionType) => {
    setSelectedTypes(current =>
      current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
    );
  };

  const startExam = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one question type",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get the unit ID first
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('id')
        .eq('code', code)
        .single();

      if (unitError) throw unitError;

      // Create a new exam session
      const tempStudentId = crypto.randomUUID();
      const { data: sessionData, error: sessionError } = await supabase
        .from('exam_sessions')
        .insert({
          unit_id: unitData.id,
          student_id: tempStudentId,
          question_types: selectedTypes,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Navigate to the exam with the session ID
      navigate(`/exam/${sessionData.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Exam Setup</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Select Question Types</h2>
          <p className="text-gray-600 mb-6">
            Choose the types of questions you want in your exam.
          </p>

          <div className="space-y-4">
            {questionTypes.map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={selectedTypes.includes(id as QuestionType)}
                  onCheckedChange={() => handleTypeToggle(id as QuestionType)}
                />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
          </div>

          <Button
            className="mt-8 w-full"
            onClick={startExam}
            disabled={loading || selectedTypes.length === 0}
          >
            {loading ? "Setting up exam..." : "Start Exam"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
