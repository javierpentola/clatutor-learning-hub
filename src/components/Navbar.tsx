
import { Home, Info, Headset, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Navbar = () => {
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const languages = [
    { name: "English", code: "en" },
    { name: "Español", code: "es" },
    { name: "Tiếng Việt", code: "vi" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-[#1a365d] mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-12">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Home className="w-5 h-5 mr-2" />
              <span>Index</span>
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Info className="w-5 h-5 mr-2" />
              <span>About Us</span>
            </Link>

            <Link
              to="/support"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Headset className="w-5 h-5 mr-2" />
              <span>Support Us</span>
            </Link>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <Globe className="w-5 h-5 mr-2" />
                <span>{currentLanguage}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => setCurrentLanguage(language.name)}
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
