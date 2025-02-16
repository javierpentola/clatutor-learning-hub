import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Copy, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type Unit = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  created_at: string;
};

const Teacher = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const { data: units, refetch: refetchUnits } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Unit[];
    },
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Unit code has been copied to clipboard",
    });
  };

  const handleCreateUnit = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user logged in");

      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_unique_unit_code');
      
      if (codeError) throw codeError;
      
      const { error } = await supabase.from("units").insert([
        {
          title,
          description,
          code: codeData,
          teacher_id: user.id
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Unit created successfully",
      });

      setIsCreateOpen(false);
      setTitle("");
      setDescription("");
      refetchUnits();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'} relative`}>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 mb-6 animate-fade-in border border-gray-300 dark:border-gray-600 hover:border-primary"
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="lg" 
              className="gap-2 self-center"
            >
              <Plus className="h-5 w-5" />
              Create Unit
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Your Units</h1>
              <p className="text-muted-foreground mt-2">
                Create and manage your teaching units
              </p>
            </div>
          </div>

          {!units?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No units created yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first teaching unit. You can add questions and answers later.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>Create Your First Unit</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {units.map((unit) => (
                <div key={unit.id} className="flex flex-col">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group flex-1"
                    onClick={() => navigate(`/unit/${unit.id}`)}
                  >
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                          {unit.title}
                        </CardTitle>
                        {unit.description && (
                          <CardDescription className="line-clamp-2">
                            {unit.description}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(unit.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                  <div 
                    className="mt-2 bg-primary/10 px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                    onDoubleClick={() => handleCopyCode(unit.code)}
                  >
                    <span className="text-primary font-mono text-sm mr-2">{unit.code}</span>
                    <Copy className="h-4 w-4 text-primary/70" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Unit</DialogTitle>
              <DialogDescription>
                Create a new unit for your students. You can add questions and answers after creating the unit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter unit title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter unit description"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUnit} disabled={!title}>
                Create Unit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Teacher;
