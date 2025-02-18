
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const translations = {
  en: {
    title: "Support CLA.app",
    subtitle: "Educational non-profit project",
    description1: "CLA.app is a non-profit project dedicated to making education more accessible. While we operate without profit, we need to cover basic maintenance costs such as hosting, domain, and Supabase services.",
    description2: "If you wish to contribute, you can donate any amount you consider. Any contribution beyond our operational expenses is not necessary, but we deeply appreciate it and it will be reinvested in improving the platform.",
    patreonButton: "Support on Patreon",
    shareButton: "Share CLA.app",
    githubButton: "⭐ Star on GitHub"
  },
  es: {
    title: "Apoya a CLA.app",
    subtitle: "Proyecto educativo benéfico",
    description1: "CLA.app es un proyecto benéfico dedicado a hacer la educación más accesible. Aunque operamos sin fines de lucro, necesitamos cubrir gastos básicos de mantenimiento como el hosting, dominio y servicios de Supabase.",
    description2: "Si deseas contribuir, puedes donar la cantidad que consideres. Cualquier aporte más allá de nuestros gastos operativos no es necesario, pero lo agradecemos profundamente y será reinvertido en mejorar la plataforma.",
    patreonButton: "Apoyar en Patreon",
    shareButton: "Compartir CLA.app",
    githubButton: "⭐ Star en GitHub"
  },
  vi: {
    title: "Hỗ trợ CLA.app",
    subtitle: "Dự án giáo dục phi lợi nhuận",
    description1: "CLA.app là một dự án phi lợi nhuận nhằm mục đích làm cho giáo dục dễ tiếp cận hơn. Mặc dù chúng tôi hoạt động phi lợi nhuận, chúng tôi cần trang trải các chi phí bảo trì cơ bản như hosting, tên miền và dịch vụ Supabase.",
    description2: "Nếu bạn muốn đóng góp, bạn có thể quyên góp bất kỳ số tiền nào bạn thấy phù hợp. Bất kỳ đóng góp nào vượt quá chi phí hoạt động của chúng tôi đều không cần thiết, nhưng chúng tôi đánh giá cao và sẽ được tái đầu tư để cải thiện nền tảng.",
    patreonButton: "Hỗ trợ trên Patreon",
    shareButton: "Chia sẻ CLA.app",
    githubButton: "⭐ Star trên GitHub"
  }
};

const Support = () => {
  const [language, setLanguage] = useState("en");

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
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto text-[#ea384c] mb-4">
            <FaHeart className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
          <p className="text-gray-600 mb-6">
            {t.subtitle}
          </p>
        </div>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            {t.description1}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t.description2}
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#FF424D] hover:bg-[#FF5C66] text-white"
              onClick={() => window.open("https://www.patreon.com/claapp", "_blank")}
            >
              {t.patreonButton}
            </Button>
            <Button variant="outline" className="w-full">
              {t.shareButton}
            </Button>
            <Button variant="outline" className="w-full">
              {t.githubButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
