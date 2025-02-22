
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteUnit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      const { error } = await supabase
        .from("units")
        .delete()
        .eq("id", unitId);

      if (error) {
        console.error("Delete unit error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast({
        title: "Success",
        description: "Unit deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting unit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete unit",
        variant: "destructive",
      });
    },
  });
};
