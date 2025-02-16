
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportDialog = ({ open, onOpenChange }: SupportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm duration-300 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out">
        <DialogHeader className="text-center">
          <div className="mx-auto text-[#ea384c] mb-4 animate-scale-in">
            <FaHeart className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold mb-2 animate-fade-in">Support CLA.app</DialogTitle>
          <DialogDescription className="text-gray-600 animate-fade-in">
            Help us make education accessible
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-4 animate-fade-in">
          <Button className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white">
            Make a Donation
          </Button>
          <Button variant="outline" className="w-full">
            Share CLA.app
          </Button>
          <Button variant="outline" className="w-full">
            Star on GitHub
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
