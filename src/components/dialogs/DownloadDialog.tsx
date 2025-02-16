
import { FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DownloadDialog = ({ open, onOpenChange }: DownloadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md duration-300 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out">
        <DialogHeader className="text-center">
          <div className="mx-auto text-[#1a365d] mb-4 animate-scale-in">
            <FaDownload className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold mb-2 animate-fade-in">Download CLA.app APK</DialogTitle>
          <DialogDescription className="text-gray-600 animate-fade-in">
            To download and install the CLA.app APK on your Android device, follow these steps:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 animate-fade-in">
            <li>Enable installation from unknown sources in your device settings.</li>
            <li>Click the download button below to start the download.</li>
            <li>Once downloaded, open the APK file to begin installation.</li>
            <li>Follow the on-screen instructions to complete the installation.</li>
          </ol>
          <Button className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white mt-4 animate-fade-in">
            <FaDownload className="mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
