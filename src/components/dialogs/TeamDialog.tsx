
import { FaUsers } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const teamMembers: TeamMember[] = [
  {
    name: "Otto",
    role: "Chief Happiness Officer",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  },
  {
    name: "Kenji",
    role: "Security Manager",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    name: "Fisher",
    role: "Snack Coordinator",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  }
];

export const TeamDialog = ({ open, onOpenChange }: TeamDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg duration-500 ease-in-out transform transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2">
        <DialogHeader className="text-center">
          <div className="mx-auto text-[#1a365d] mb-4">
            <FaUsers className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold mb-2">Our Team</DialogTitle>
          <DialogDescription className="text-gray-600">
            Meet the people behind CLA.app
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 pt-8">
          {teamMembers.map(member => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 transform transition-all duration-500">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-bold text-[#1a365d]">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
