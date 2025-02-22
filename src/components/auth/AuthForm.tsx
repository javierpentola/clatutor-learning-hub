import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const translations = {
  en: {
    title: {
      default: "Welcome back",
      signup: "Create account",
      forgot: "Reset password"
    },
    subtitle: {
      default: "Sign in to access your account",
      signup: "Register to get started",
      forgot: "Enter your email to reset your password"
    },
    email: "Email",
    password: "Password",
    button: {
      default: "Sign in",
      signup: "Sign up",
      forgot: "Send instructions"
    },
    forgotPassword: "Forgot password?",
    haveAccount: "Already have an account? ",
    noAccount: "Don't have an account? ",
    signIn: "Sign in",
    signUp: "Sign up",
    backToLogin: "Back to login",
    success: {
      signUp: "Successful registration!",
      checkEmail: "Please check your email to verify your account",
      welcome: "Welcome!",
      accessing: "Accessing your teacher space..."
    }
  },
  es: {
    title: {
      default: "Bienvenido de nuevo",
      signup: "Crear cuenta",
      forgot: "Restablecer contraseña"
    },
    subtitle: {
      default: "Inicia sesión para acceder a tu cuenta",
      signup: "Regístrate para comenzar",
      forgot: "Ingresa tu email para restablecer tu contraseña"
    },
    email: "Email",
    password: "Contraseña",
    button: {
      default: "Iniciar sesión",
      signup: "Registrarse",
      forgot: "Enviar instrucciones"
    },
    forgotPassword: "¿Olvidaste tu contraseña?",
    haveAccount: "¿Ya tienes una cuenta? ",
    noAccount: "¿No tienes una cuenta? ",
    signIn: "Inicia sesión",
    signUp: "Regístrate",
    backToLogin: "Volver al inicio de sesión",
    success: {
      signUp: "¡Registro exitoso!",
      checkEmail: "Por favor, revisa tu correo electrónico para verificar tu cuenta",
      welcome: "¡Bienvenido!",
      accessing: "Accediendo a tu espacio de profesor..."
    }
  },
  vi: {
    title: {
      default: "Chào mừng trở lại",
      signup: "Tạo tài khoản",
      forgot: "Đặt lại mật khẩu"
    },
    subtitle: {
      default: "Đăng nhập để truy cập tài khoản của bạn",
      signup: "Đăng ký để bắt đầu",
      forgot: "Nhập email của bạn để đặt lại mật khẩu"
    },
    email: "Email",
    password: "Mật khẩu",
    button: {
      default: "Đăng nhập",
      signup: "Đăng ký",
      forgot: "Gửi hướng dẫn"
    },
    forgotPassword: "Quên mật khẩu?",
    haveAccount: "Đã có tài khoản? ",
    noAccount: "Chưa có tài khoản? ",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    backToLogin: "Quay lại đăng nhập",
    success: {
      signUp: "Đăng ký thành công!",
      checkEmail: "Vui lòng kiểm tra email của bạn để xác minh tài khoản",
      welcome: "Chào mừng!",
      accessing: "Đang truy cập không gian giáo viên của bạn..."
    }
  }
};

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem("language") || "en";
      setLanguage(newLang);
    };

    handleLanguageChange();
    window.addEventListener("languageChange", handleLanguageChange);
    return () => window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const t = translations[language as keyof typeof translations];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/teacher`
        });
        if (error) throw error;
        toast({
          title: t.success.checkEmail,
          description: ""
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
          title: t.success.signUp,
          description: t.success.checkEmail
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
          title: t.success.welcome,
          description: t.success.accessing
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
          ? t.title.forgot
          : isSignUp 
            ? t.title.signup 
            : t.title.default}
      </h1>
      <p className="text-gray-600 mb-8">
        {isForgotPassword 
          ? t.subtitle.forgot
          : isSignUp 
            ? t.subtitle.signup 
            : t.subtitle.default}
      </p>
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="text-left">
          <Label htmlFor="email">{t.email}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t.email}
            required
            className="w-full h-12"
          />
        </div>
        {!isForgotPassword && (
          <div className="text-left">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.password}
              required
              className="w-full h-12"
            />
          </div>
        )}
        <Button type="submit" className="w-full bg-[#1a365d] hover:bg-[#2a4a7f] text-white h-12">
          {isForgotPassword 
            ? t.button.forgot
            : isSignUp 
              ? t.button.signup 
              : t.button.default}
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        {!isForgotPassword ? (
          <>
            <p className="text-gray-600">
              {isSignUp ? t.haveAccount : t.noAccount}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-[#1a365d] hover:underline"
              >
                {isSignUp ? t.signIn : t.signUp}
              </button>
            </p>
            {!isSignUp && (
              <p>
                <button 
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[#1a365d] hover:underline text-sm"
                >
                  {t.forgotPassword}
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
              {t.backToLogin}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
