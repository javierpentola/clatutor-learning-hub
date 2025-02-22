
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
import { Pencil, Trash2, FolderPlus, ArrowLeft } from "lucide-react";
import { DeleteUnitButton } from "@/components/units/DeleteUnitButton";

const translations = {
  en: {
    title: "My Units",
    addUnit: "Add Unit",
    createUnit: "Create a new unit for your class.",
    unitTitle: "Title",
    description: "Description (optional)",
    enterTitle: "Enter unit title",
    enterDescription: "Enter unit description",
    cancel: "Cancel",
    add: "Add",
    save: "Save",
    manageQA: "Manage Questions & Answers",
    loading: "Loading...",
    errors: {
      titleRequired: "Title is required",
      loginRequired: "You must be logged in to access this page",
    },
    success: {
      unitCreated: "Unit created successfully",
      unitUpdated: "Unit updated successfully",
      unitDeleted: "Unit deleted successfully",
    },
    deleteUnit: "Delete Unit",
    confirmDelete: "Are you sure you want to delete this unit?",
  },
  es: {
    title: "Mis Unidades",
    addUnit: "Añadir Unidad",
    createUnit: "Crea una nueva unidad para tu clase.",
    unitTitle: "Título",
    description: "Descripción (opcional)",
    enterTitle: "Ingresa el título de la unidad",
    enterDescription: "Ingresa la descripción de la unidad",
    cancel: "Cancelar",
    add: "Añadir",
    save: "Guardar",
    manageQA: "Gestionar Preguntas y Respuestas",
    loading: "Cargando...",
    errors: {
      titleRequired: "El título es requerido",
      loginRequired: "Debes iniciar sesión para acceder a esta página",
    },
    success: {
      unitCreated: "Unidad creada exitosamente",
      unitUpdated: "Unidad actualizada exitosamente",
      unitDeleted: "Unidad eliminada exitosamente",
    },
    deleteUnit: "Eliminar Unidad",
    confirmDelete: "¿Estás seguro de que quieres eliminar esta unidad?",
  },
  vi: {
    title: "Đơn vị của tôi",
    addUnit: "Thêm đơn vị",
    createUnit: "Tạo một đơn vị mới cho lớp của bạn.",
    unitTitle: "Tiêu đề",
    description: "Mô tả (tùy chọn)",
    enterTitle: "Nhập tiêu đề đơn vị",
    enterDescription: "Nhập mô tả đơn vị",
    cancel: "Hủy",
    add: "Thêm",
    save: "Lưu",
    manageQA: "Quản lý Câu hỏi & Đáp án",
    loading: "Đang tải...",
    errors: {
      titleRequired: "Cần có tiêu đề",
      loginRequired: "Bạn phải đăng nhập để truy cập trang này",
    },
    success: {
      unitCreated: "Tạo đơn vị thành công",
      unitUpdated: "Cập nhật đơn vị thành công",
      unitDeleted: "Xóa đơn vị thành công",
    },
    deleteUnit: "Xóa Đơn vị",
    confirmDelete: "Bạn có chắc chắn muốn xóa đơn vị này không?",
  },
};

const Teacher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [editingUnit, setEditingUnit] = useState<{
    id: string;
    title: string;
    description: string | null;
  } | null>(null);
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null);

  useEffect(() => {
    const getTeacherId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTeacherId(user.id);
      } else {
        navigate('/');
        toast({
          title: "Error",
          description: translations[language as keyof typeof translations].errors.loginRequired,
          variant: "destructive",
        });
      }
    };

    const currentLang = localStorage.getItem("language") || "en";
    setLanguage(currentLang);

    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    getTeacherId();

    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, [navigate, toast, language]);

  const { data: units, isLoading } = useQuery({
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

  const t = translations[language as keyof typeof translations];

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
        description: t.success.unitCreated,
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
        description: t.success.unitUpdated,
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
      const { error: unitError } = await supabase
        .from("units")
        .delete()
        .eq("id", unitId);
      
      if (unitError) throw unitError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setDeletingUnitId(null);
      toast({
        title: "Success",
        description: t.success.unitDeleted,
      });
    },
    onError: (error: any) => {
      console.error("Delete mutation error:", error);
      setDeletingUnitId(null);
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
        description: t.errors.titleRequired,
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
        description: t.errors.titleRequired,
        variant: "destructive",
      });
      return;
    }
    updateUnit.mutate();
  };

  const handleDeleteUnit = async (unitId: string) => {
    setDeletingUnitId(unitId);
    try {
      await deleteUnit.mutateAsync(unitId);
    } catch (error) {
      console.error("Error in handleDeleteUnit:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{t.loading}</div>
      </div>
    );
  }

  if (!teacherId) return null;

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              {t.addUnit}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addUnit}</DialogTitle>
              <DialogDescription>{t.createUnit}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t.unitTitle}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.enterTitle}
                />
              </div>
              <div>
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.enterDescription}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUnitOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleAddUnit} disabled={addUnit.isPending}>
                {t.add}
              </Button>
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
                    <Button onClick={handleUpdateUnit} disabled={updateUnit.isPending}>
                      {t.save}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingUnit(null)}
                    >
                      {t.cancel}
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
                  {t.manageQA}
                </Button>
                <DeleteUnitButton unitId={unit.id} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teacher;
