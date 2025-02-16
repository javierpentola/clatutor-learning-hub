
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Teacher from "./pages/Teacher";
import UnitDetail from "./pages/UnitDetail";
import Student from "./pages/Student";
import Flashcards from "./pages/Flashcards";
import Combine from "./pages/Combine";
import ExamSetup from "./pages/ExamSetup";
import Exam from "./pages/Exam";
import MemoryGame from "./pages/Learn"; // Cambiamos el nombre del import para que sea más descriptivo

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/unit/:id" element={<UnitDetail />} />
        <Route path="/student/:code" element={<Student />} />
        <Route path="/flashcards/:code" element={<Flashcards />} />
        <Route path="/combine/:code" element={<Combine />} />
        <Route path="/exam-setup/:code" element={<ExamSetup />} />
        <Route path="/exam/:sessionId" element={<Exam />} />
        <Route path="/learn/:code" element={<MemoryGame />} /> {/* Añadimos el parámetro code */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
