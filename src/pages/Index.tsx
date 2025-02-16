
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaHeart, FaDownload, FaUsers } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [showMobileButtons, setShowMobileButtons] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 100;
      const isScrollingUp = currentScrollY < lastScrollY;

      setShowMobileButtons(isAtBottom && !isScrollingUp);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/teacher`
          }
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate('/teacher');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class code",
        variant: "destructive",
      });
      return;
    }

    navigate(`/student/${classCode}`);
  };

  return (
    <div className="min-h-screen font-roboto pb-24 md:pb-0">
      <div className="grid md:grid-cols-2 h-screen">
        <div className="relative bg-gray-50 p-8 flex flex-col">
          <Logo size={40} />
          <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full">
            <div className="text-center w-full">
              <h1 className="text-3xl font-bold text-[#1a365d] mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-gray-600 mb-8">
                {isSignUp ? "Sign up to get started" : "Sign in to access your account"}
              </p>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="text-left">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full h-12"
                  />
                </div>
                <div className="text-left">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full h-12"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white h-12"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </form>
              <p className="mt-4 text-gray-600">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#1a365d] hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-[#1a365d] p-8 flex flex-col">
          <Logo size={40} className="filter brightness-0 invert" />
          <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full">
            <div className="text-center w-full">
              <h2 className="text-3xl font-bold text-white mb-2">Join Your Class</h2>
              <p className="text-gray-300 mb-8">Enter your class code to get started</p>
              <form onSubmit={handleJoinClass} className="space-y-4">
                <div className="text-left">
                  <label className="text-white mb-2 block">Class Code</label>
                  <Input 
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Enter class code"
                    className="w-full h-12 bg-[#2a4a7f] border-[#2a4a7f] text-white placeholder:text-gray-400"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-[#1a365d] h-12 font-medium"
                >
                  Join Class
                </Button>
              </form>
            </div>
          </div>

          <div className="hidden md:flex absolute bottom-8 right-8 flex-col gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowSupportDialog(true)}
              className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-white"
            >
              <FaHeart className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowTeamDialog(true)}
              className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-white"
            >
              <FaUsers className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDownloadDialog(true)}
              className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-white"
            >
              <FaDownload className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center gap-4 shadow-lg transition-all duration-500 ease-in-out ${showMobileButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
        <Button 
          variant="outline" 
          onClick={() => setShowSupportDialog(true)}
          className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-[#1a365d]"
        >
          <FaHeart className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowTeamDialog(true)}
          className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-[#1a365d]"
        >
          <FaUsers className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowDownloadDialog(true)}
          className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-[#1a365d]"
        >
          <FaDownload className="h-5 w-5" />
        </Button>
      </div>

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

      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="max-w-lg">
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
            {[
              { name: "Otto", role: "Chief Happiness Officer", image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952" },
              { name: "Kenji", role: "Security Manager", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
              { name: "Fisher", role: "Snack Coordinator", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e" }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="font-bold text-[#1a365d]">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto text-[#1a365d] mb-4">
              <FaDownload className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Download CLA.app APK</DialogTitle>
            <DialogDescription className="text-gray-600">
              To download and install the CLA.app APK on your Android device, follow these steps:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Enable installation from unknown sources in your device settings.</li>
              <li>Click the download button below to start the download.</li>
              <li>Once downloaded, open the APK file to begin installation.</li>
              <li>Follow the on-screen instructions to complete the installation.</li>
            </ol>
            <Button className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white mt-4">
              <FaDownload className="mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
