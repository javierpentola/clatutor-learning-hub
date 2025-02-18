
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
      <DialogContent className="max-w-md duration-300 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out">
        <DialogHeader className="text-center">
          <div className="mx-auto text-[#ea384c] mb-4 animate-scale-in">
            <FaHeart className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold mb-2 animate-fade-in">Apoya a CLA.app</DialogTitle>
          <DialogDescription className="text-gray-600 animate-fade-in">
            Proyecto educativo benéfico
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4 animate-fade-in">
          <p className="text-gray-600 text-sm leading-relaxed">
            CLA.app es un proyecto benéfico dedicado a hacer la educación más accesible. 
            Aunque operamos sin fines de lucro, necesitamos cubrir gastos básicos de mantenimiento 
            como el hosting, dominio y servicios de Supabase.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Si deseas contribuir, puedes donar la cantidad que consideres. Cualquier 
            aporte más allá de nuestros gastos operativos no es necesario, pero lo 
            agradecemos profundamente y será reinvertido en mejorar la plataforma.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#FF424D] hover:bg-[#FF5C66] text-white"
              onClick={() => window.open("https://www.patreon.com/claapp", "_blank")}
            >
              Apoyar en Patreon
            </Button>
            <Button variant="outline" className="w-full">
              Compartir CLA.app
            </Button>
            <Button variant="outline" className="w-full">
              ⭐ Star en GitHub
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
