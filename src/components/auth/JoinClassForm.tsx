
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const JoinClassForm = () => {
  const [classCode, setClassCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class code",
        variant: "destructive"
      });
      return;
    }
    navigate(`/student/${classCode}`);
  };

  return (
    <div className="text-center w-full">
      <h2 className="text-3xl font-bold text-white mb-2">Join Your Class</h2>
      <p className="text-gray-300 mb-8">Enter your class code to get started</p>
      <form onSubmit={handleJoinClass} className="space-y-4">
        <div className="text-left">
          <label className="text-white mb-2 block">Class Code</label>
          <Input
            value={classCode}
            onChange={e => setClassCode(e.target.value)}
            placeholder="Enter class code"
            className="w-full h-12 bg-[#2a4a7f] border-[#2a4a7f] text-white placeholder:text-gray-400"
          />
        </div>
        <Button type="submit" className="w-full bg-white hover:bg-gray-100 text-[#1a365d] h-12 font-medium">
          Join Class
        </Button>
      </form>
    </div>
  );
};
