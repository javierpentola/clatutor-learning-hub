
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddQAOpen, setIsAddQAOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const { data: unit } = useQuery({
    queryKey: ["unit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Unit;
    },
  });

  const { data: questionsAnswers } = useQuery({
    queryKey: ["questions_answers", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions_answers")
        .select("*")
        .eq("unit_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as QuestionAnswer[];
    },
  });

  const addQuestionAnswer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("questions_answers").insert([
        {
          unit_id: id,
          question,
          answer,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions_answers", id] });
      setIsAddQAOpen(false);
      setQuestion("");
      setAnswer("");
      toast({
        title: "Success",
        description: "Question and answer added successfully",
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
      queryClient.invalidateQueries({ queryKey: ["questions_answers", id] });
      toast({
        title: "Success",
        description: "Question and answer deleted successfully",
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
        description: "Both question and answer are required",
        variant: "destructive",
      });
      return;
    }
    addQuestionAnswer.mutate();
  };

  if (!unit) return null;

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate("/teacher")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Units
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
              Add Question & Answer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Question & Answer</DialogTitle>
              <DialogDescription>
                Add a new question and answer to this unit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question"
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the answer"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddQAOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQA}>Add</Button>
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
                  <CardTitle>Question</CardTitle>
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
                <h4 className="font-semibold mb-2">Answer</h4>
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
