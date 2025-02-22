
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Teacher from "./pages/Teacher";
import About from "./pages/About";
import Support from "./pages/Support";
import Learn from "./pages/Learn";
import Exam from "./pages/Exam";
import ExamSetup from "./pages/ExamSetup";
import Flashcards from "./pages/Flashcards";
import Student from "./pages/Student";
import UnitDetail from "./pages/UnitDetail";
import Combine from "./pages/Combine";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/learn/:code" element={<Learn />} />
          <Route path="/exam/:sessionId" element={<Exam />} />
          <Route path="/exam-setup/:code" element={<ExamSetup />} />
          <Route path="/flashcards/:code" element={<Flashcards />} />
          <Route path="/student/:code" element={<Student />} />
          <Route path="/combine/:code" element={<Combine />} />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit/:code"
            element={
              <ProtectedRoute>
                <UnitDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
