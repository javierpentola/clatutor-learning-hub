import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, FolderPlus } from "lucide-react";

const Teacher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<{
    id: string;
    title: string;
    description: string | null;
  } | null>(null);

  useEffect(() => {
    const getTeacherId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTeacherId(user.id);
      } else {
        navigate('/');
        toast({
          title: "Error",
          description: "You must be logged in to access this page",
          variant: "destructive",
        });
      }
    };

    getTeacherId();
  }, [navigate, toast]);

  const { data: units } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      if (!teacherId) return [];
      
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!teacherId,
  });

  const addUnit = useMutation({
    mutationFn: async () => {
      if (!teacherId) throw new Error("No teacher ID found");

      const { data: codeResult, error: codeError } = await supabase
        .rpc('generate_unique_unit_code');
      
      if (codeError) throw codeError;
      
      const { data: newUnit, error } = await supabase
        .from("units")
        .insert([{
          title,
          description,
          teacher_id: teacherId,
          code: codeResult,
        }])
        .select()
        .single();

      if (error) throw error;
      return newUnit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsAddUnitOpen(false);
      setTitle("");
      setDescription("");
      toast({
        title: "Success",
        description: "Unit created successfully",
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

  const updateUnit = useMutation({
    mutationFn: async () => {
      if (!editingUnit) return;

      const { error } = await supabase
        .from("units")
        .update({ title: editingUnit.title, description: editingUnit.description })
        .eq("id", editingUnit.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setEditingUnit(null);
      toast({
        title: "Success",
        description: "Unit updated successfully",
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

  const deleteUnit = useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase.from("units").delete().eq("id", unitId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast({
        title: "Success",
        description: "Unit deleted successfully",
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

  const handleAddUnit = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    addUnit.mutate();
  };

  const handleUpdateUnit = () => {
    if (!editingUnit?.title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    updateUnit.mutate();
  };

  if (!teacherId) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Units</h1>
        <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Unit</DialogTitle>
              <DialogDescription>Create a new unit for your class.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter unit title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter unit description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUnitOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUnit}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {units?.map((unit) => (
          <Card key={unit.id} className="flex flex-col">
            <CardHeader>
              {editingUnit?.id === unit.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingUnit.title}
                    onChange={(e) =>
                      setEditingUnit({ ...editingUnit, title: e.target.value })
                    }
                  />
                  <Textarea
                    value={editingUnit.description || ""}
                    onChange={(e) =>
                      setEditingUnit({
                        ...editingUnit,
                        description: e.target.value,
                      })
                    }
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateUnit}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingUnit(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">{unit.title}</CardTitle>
                    {unit.description && (
                      <CardDescription>{unit.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setEditingUnit({
                          id: unit.id,
                          title: unit.title,
                          description: unit.description,
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteUnit.mutate(unit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="mt-4 space-y-2">
                <div className="bg-primary/10 px-3 py-1 rounded-full w-fit">
                  <span className="text-primary font-mono">{unit.code}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/unit/${unit.code}`)}
                >
                  Manage Questions & Answers
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teacher;
