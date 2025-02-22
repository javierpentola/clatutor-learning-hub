
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUnit } from "@/hooks/useDeleteUnit";

interface DeleteUnitDialogProps {
  unitId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteUnitDialog = ({ unitId, isOpen, onClose }: DeleteUnitDialogProps) => {
  const deleteUnit = useDeleteUnit();

  const handleDelete = async () => {
    await deleteUnit.mutateAsync(unitId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Unit</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this unit? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteUnit.isPending}
          >
            {deleteUnit.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
