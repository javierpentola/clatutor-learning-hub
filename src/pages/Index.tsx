
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaHeart, FaDownload, FaUsers } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

const Index = () => {
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  return (
    <div className="min-h-screen font-roboto">
      <div className="grid md:grid-cols-2 h-screen">
        {/* Left Section */}
        <div className="relative bg-gray-50 p-8 flex flex-col">
          <Logo size={40} />
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-[#1a365d] mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Sign in to access your account</p>
            <Button 
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-normal h-12"
              onClick={() => console.log("Google login clicked")}
            >
              <FaGoogle className="mr-2" />
              Sign in with Google
            </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative bg-[#1a365d] p-8 flex flex-col">
          <Logo size={40} className="filter brightness-0 invert" />
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Join Your Class</h2>
              <p className="text-gray-300">Enter your class code to get started</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white mb-2 block">Class Code</label>
                <Input 
                  placeholder="Class Code"
                  className="w-full h-12 bg-[#2a4a7f] border-[#2a4a7f] text-white placeholder:text-gray-400"
                />
              </div>
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-[#1a365d] h-12 font-medium"
              >
                Join Class
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowSupportDialog(true)}
              className="text-white hover:bg-[#2a4a7f] rounded-full w-12 h-12 p-0"
            >
              <FaHeart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-[#2a4a7f] rounded-full w-12 h-12 p-0"
            >
              <FaUsers className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-[#2a4a7f] rounded-full w-12 h-12 p-0"
            >
              <FaDownload className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center">
            <div className="mx-auto text-[#ea384c] mb-4">
              <FaHeart className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Support CLA.app</DialogTitle>
            <DialogDescription className="text-gray-600">
              Help us make education accessible
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
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
    </div>
  );
};

export default Index;
