
import { BookOpen, Brain, HelpCircle, Shuffle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Student = () => {
  const navigate = useNavigate();
  const { code } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1a365d] mb-8">Welcome, Student!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            className="bg-[#ea384c] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/flashcards/${code}`)}
          >
            <BookOpen className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">Flashcards</span>
          </button>

          <button 
            className="bg-[#1a365d] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate("/learn")}
          >
            <Brain className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">Learn</span>
          </button>

          <button 
            className="bg-[#8E9196] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/exam-setup/${code}`)}
          >
            <HelpCircle className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">Exam</span>
          </button>

          <button 
            className="bg-[#ea384c] text-white p-8 rounded-xl hover:opacity-90 transition-opacity text-left"
            onClick={() => navigate(`/combine/${code}`)}
          >
            <Shuffle className="w-8 h-8 mb-4" />
            <span className="text-2xl font-semibold">Combine</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Student;
