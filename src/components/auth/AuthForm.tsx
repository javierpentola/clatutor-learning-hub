
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
          description: "Please check your email to verify your account"
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

  return (
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full h-12"
          />
        </div>
        <Button type="submit" className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white h-12">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
      <p className="mt-4 text-gray-600">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#1a365d] hover:underline">
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};
