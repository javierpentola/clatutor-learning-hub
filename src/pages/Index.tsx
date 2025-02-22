import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { FaHeart, FaDownload } from "react-icons/fa";
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { JoinClassForm } from "@/components/auth/JoinClassForm";
import { SupportDialog } from "@/components/dialogs/SupportDialog";
import { DownloadDialog } from "@/components/dialogs/DownloadDialog";
const Index = () => {
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showMobileButtons, setShowMobileButtons] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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
  return <div className="min-h-screen font-roboto pb-40 md:pb-0 px-4 py-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="relative bg-gray-50 p-8 flex flex-col rounded-lg shadow-lg border-2 border-[#1a365d]">
            <div className="flex justify-center md:justify-start mb-12">
              <Logo size={40} />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full">
              <AuthForm />
            </div>
          </div>

          <div className="relative bg-[#1a365d] p-8 flex flex-col rounded-lg shadow-lg border-2 border-[#1a365d]">
            <div className="flex justify-center md:justify-start mb-12">
              <Logo size={40} className="filter brightness-0 invert" textClassName="text-white" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full">
              <JoinClassForm />
            </div>

            <div className="hidden md:flex absolute bottom-8 right-8 flex-col gap-4">
              
              
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center gap-4 shadow-lg transition-all duration-500 ease-in-out ${showMobileButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
        <Button variant="outline" onClick={() => setShowSupportDialog(true)} className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-[#1a365d]">
          <FaHeart className="h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={() => setShowDownloadDialog(true)} className="text-[#1a365d] bg-white hover:bg-gray-50 rounded-full w-12 h-12 p-0 border-2 border-[#1a365d]">
          <FaDownload className="h-5 w-5" />
        </Button>
      </div>

      <SupportDialog open={showSupportDialog} onOpenChange={setShowSupportDialog} />
      <DownloadDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog} />
    </div>;
};
export default Index;