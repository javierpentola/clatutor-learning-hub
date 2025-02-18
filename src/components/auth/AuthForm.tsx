
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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/teacher`
        });
        if (error) throw error;
        toast({
          title: "¡Email enviado!",
          description: "Revisa tu correo electrónico para restablecer tu contraseña"
        });
        setIsForgotPassword(false);
        setEmail("");
        return;
      }

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
          title: "¡Registro exitoso!",
          description: "Por favor, revisa tu correo electrónico para verificar tu cuenta"
        });
        setEmail("");
        setPassword("");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "¡Bienvenido!",
          description: "Accediendo a tu espacio de profesor..."
        });
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

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setEmail("");
  };

  return (
    <div className="text-center w-full">
      <h1 className="text-3xl font-bold text-[#1a365d] mb-2">
        {isForgotPassword 
          ? "Restablecer contraseña"
          : isSignUp 
            ? "Crear cuenta" 
            : "Bienvenido de nuevo"}
      </h1>
      <p className="text-gray-600 mb-8">
        {isForgotPassword 
          ? "Ingresa tu email para restablecer tu contraseña"
          : isSignUp 
            ? "Regístrate para comenzar" 
            : "Inicia sesión para acceder a tu cuenta"}
      </p>
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="text-left">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Ingresa tu email"
            required
            className="w-full h-12"
          />
        </div>
        {!isForgotPassword && (
          <div className="text-left">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full h-12"
            />
          </div>
        )}
        <Button type="submit" className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white h-12">
          {isForgotPassword 
            ? "Enviar instrucciones"
            : isSignUp 
              ? "Registrarse" 
              : "Iniciar sesión"}
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        {!isForgotPassword ? (
          <>
            <p className="text-gray-600">
              {isSignUp ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-[#1a365d] hover:underline"
              >
                {isSignUp ? "Inicia sesión" : "Regístrate"}
              </button>
            </p>
            {!isSignUp && (
              <p>
                <button 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[#1a365d] hover:underline text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </p>
            )}
          </>
        ) : (
          <p>
            <button 
              onClick={handleBackToLogin}
              className="text-[#1a365d] hover:underline text-sm"
            >
              Volver al inicio de sesión
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
