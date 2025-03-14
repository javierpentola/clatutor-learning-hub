
import { Home, Info, Headset, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const translations = {
  en: {
    index: "Index",
    about: "About Us",
    support: "Support CLA.app"
  },
  es: {
    index: "Inicio",
    about: "Sobre Nosotros",
    support: "Apoya CLA.app"
  },
  vi: {
    index: "Trang chủ",
    about: "Về chúng tôi",
    support: "Hỗ trợ CLA.app"
  }
};

export const Navbar = () => {
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [language, setLanguage] = useState("en");

  const languages = [
    { name: "English", code: "en" },
    { name: "Español", code: "es" },
    { name: "Tiếng Việt", code: "vi" },
  ];

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

  return (
    <nav className="bg-white shadow-lg border-b-2 border-[#1a365d] mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-1" />
          <div className="flex space-x-12">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>{t.index}</span>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Info className="w-5 h-5 mr-2" />
              <span>{t.about}</span>
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Headset className="w-5 h-5 mr-2" />
              <span>{t.support}</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <Globe className="w-5 h-5 mr-2" />
                <span>{currentLanguage}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => {
                      setCurrentLanguage(language.name);
                      localStorage.setItem("language", language.code);
                      window.dispatchEvent(new Event("languageChange"));
                    }}
                    className="cursor-pointer"
                  >
                    {language.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
