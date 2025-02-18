
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Combine from "./pages/Combine";
import ExamSetup from "./pages/ExamSetup";
import Exam from "./pages/Exam";
import Learn from "./pages/Learn";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import About from "./pages/About";
import Support from "./pages/Support";
import UnitDetail from "./pages/UnitDetail";
import { Toaster } from "@/components/ui/toaster";
import Flashcards from "./pages/Flashcards";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/unit/:code" element={<UnitDetail />} />
          <Route path="/student/:code" element={<Student />} />
          <Route path="/student/:code/flashcards" element={<Flashcards />} />
          <Route path="/student/:code/combine" element={<Combine />} />
          <Route path="/student/:code/exam-setup" element={<ExamSetup />} />
          <Route path="/student/:code/exam" element={<Exam />} />
          <Route path="/student/:code/learn" element={<Learn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
