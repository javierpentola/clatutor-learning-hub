
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import html2pdf from 'html2pdf.js';

interface ExamQuestion {
  id: string;
  question: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
}

const Exam = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    loadExam();
  }, [sessionId]);

  const loadExam = async () => {
    try {
      const { data: questions, error: questionsError } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('exam_session_id', sessionId)
        .order('created_at');

      if (questionsError) throw questionsError;

      setQuestions(questions);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate(-1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  const downloadResults = async () => {
    const element = document.getElementById('exam-results');
    if (!element) return;

    const opt = {
      margin: 1,
      filename: 'exam-results.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Success",
        description: "Results downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download results",
        variant: "destructive",
      });
    }
  };

  const submitExam = async () => {
    try {
      const finalScore = calculateScore();
      
      // Update exam session
      const { error: updateError } = await supabase
        .from('exam_sessions')
        .update({
          completed_at: new Date().toISOString(),
          score: finalScore,
          max_score: 100,
          responses: answers
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      setScore(finalScore);
      setExamCompleted(true);

      toast({
        title: "Success",
        description: "Exam submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading exam...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-3xl mx-auto">
        {!examCompleted ? (
          <>
            <h1 className="text-3xl font-bold mb-8">Exam</h1>
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {index + 1}. {question.question}
                  </h3>

                  {question.question_type === 'multiple_choice' && question.options && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                          <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.question_type === 'true_false' && (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`}>True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`}>False</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {question.question_type === 'open_ended' && (
                    <Textarea
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={submitExam}
              className="mt-8 w-full"
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submit Exam
            </Button>
          </>
        ) : (
          <div id="exam-results" className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">Exam Results</h1>
            <p className="text-2xl mb-8">Final Score: {score?.toFixed(1)}%</p>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b pb-4">
                  <h3 className="font-semibold">
                    {index + 1}. {question.question}
                  </h3>
                  <p className="text-gray-600 mt-2">Your answer: {answers[question.id]}</p>
                  <p className="text-gray-600">Correct answer: {question.correct_answer}</p>
                </div>
              ))}
            </div>

            <Button onClick={downloadResults} className="mt-8">
              Download Results as PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
