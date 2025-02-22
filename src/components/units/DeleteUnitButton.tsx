
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteUnitDialog } from "./DeleteUnitDialog";

interface DeleteUnitButtonProps {
  unitId: string;
}

export const DeleteUnitButton = ({ unitId }: DeleteUnitButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={() => setIsDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Unit
      </Button>
      <DeleteUnitDialog 
        unitId={unitId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
