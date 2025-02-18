
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const translations = {
  en: {
    title: "Join Your Class",
    subtitle: "Enter your class code to get started",
    classCode: "Class Code",
    placeholder: "Enter class code",
    button: "Join Class"
  },
  es: {
    title: "Únete a tu Clase",
    subtitle: "Ingresa el código de tu clase para comenzar",
    classCode: "Código de Clase",
    placeholder: "Ingresa el código de clase",
    button: "Unirse a la Clase"
  },
  vi: {
    title: "Tham gia Lớp học",
    subtitle: "Nhập mã lớp học để bắt đầu",
    classCode: "Mã lớp học",
    placeholder: "Nhập mã lớp học",
    button: "Tham gia"
  }
};

export const JoinClassForm = () => {
  const [classCode, setClassCode] = useState("");
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
      <h2 className="text-3xl font-bold text-white mb-2">{t.title}</h2>
      <p className="text-gray-300 mb-8">{t.subtitle}</p>
      <form onSubmit={handleJoinClass} className="space-y-4">
        <div className="text-left">
          <label className="text-white mb-2 block">{t.classCode}</label>
          <Input
            value={classCode}
            onChange={e => setClassCode(e.target.value)}
            placeholder={t.placeholder}
            className="w-full h-12 bg-[#2a4a7f] border-[#2a4a7f] text-white placeholder:text-gray-400"
          />
        </div>
        <Button type="submit" className="w-full bg-white hover:bg-gray-100 text-[#1a365d] h-12 font-medium">
          {t.button}
        </Button>
      </form>
    </div>
  );
};
