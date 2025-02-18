
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Combine from "./pages/Combine";
import ExamSetup from "./pages/ExamSetup";
import Exam from "./pages/Exam";
import Learn from "./pages/Learn";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import UnitDetail from "./pages/UnitDetail";
import { Toaster } from "@/components/ui/toaster";
import Flashcards from "./pages/Flashcards";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/teacher/:code" element={<UnitDetail />} />
          <Route path="/teacher/:code/exam-setup" element={<ExamSetup />} />
          <Route path="/student" element={<Student />} />
          <Route path="/student/:code/combine" element={<Combine />} />
          <Route path="/student/:code/exam" element={<Exam />} />
          <Route path="/student/:code/learn" element={<Learn />} />
          <Route path="/student/:code/flashcards" element={<Flashcards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
