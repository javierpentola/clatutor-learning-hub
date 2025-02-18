
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto text-[#ea384c] mb-4">
            <FaHeart className="h-12 w-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Apoya a CLA.app</h1>
          <p className="text-gray-600 mb-6">
            Proyecto educativo benéfico
          </p>
        </div>
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            CLA.app es un proyecto benéfico dedicado a hacer la educación más accesible. 
            Aunque operamos sin fines de lucro, necesitamos cubrir gastos básicos de mantenimiento 
            como el hosting, dominio y servicios de Supabase.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Si deseas contribuir, puedes donar la cantidad que consideres. Cualquier 
            aporte más allá de nuestros gastos operativos no es necesario, pero lo 
            agradecemos profundamente y será reinvertido en mejorar la plataforma.
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#FF424D] hover:bg-[#FF5C66] text-white"
              onClick={() => window.open("https://www.patreon.com/claapp", "_blank")}
            >
              Apoyar en Patreon
            </Button>
            <Button variant="outline" className="w-full">
              Compartir CLA.app
            </Button>
            <Button variant="outline" className="w-full">
              ⭐ Star en GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
