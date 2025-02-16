
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";

const Index = () => {
  return (
    <div className="min-h-screen font-roboto bg-gradient-to-br from-white to-clatutor-secondary">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-8 animate-fade-up">
          <Logo size={60} className="mr-4" />
          <h1 className="text-4xl font-bold text-clatutor-text">Clatutor</h1>
        </div>

        {/* Main content */}
        <div className="flex-1 grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto w-full">
          {/* Teacher Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform animate-slide-in">
            <h2 className="text-2xl font-bold text-clatutor-text mb-6">Teachers</h2>
            <p className="text-gray-600 mb-8">Access your teaching dashboard to create and manage learning units.</p>
            <Button 
              className="w-full bg-clatutor-primary hover:bg-clatutor-primary/90 text-white font-medium py-6"
              onClick={() => console.log("Google login clicked")}
            >
              <FaGoogle className="mr-2" />
              Sign in with Google
            </Button>
          </div>

          {/* Student Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform animate-slide-in delay-100">
            <h2 className="text-2xl font-bold text-clatutor-text mb-6">Students</h2>
            <p className="text-gray-600 mb-8">Enter your unit code to start learning.</p>
            <div className="space-y-4">
              <Input 
                placeholder="Enter unit code"
                className="w-full py-6 text-lg border-2 border-gray-200 focus:border-clatutor-primary"
              />
              <Button 
                className="w-full bg-clatutor-success hover:bg-clatutor-success/90 text-white font-medium py-6"
                onClick={() => console.log("Access unit clicked")}
              >
                Access Unit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
