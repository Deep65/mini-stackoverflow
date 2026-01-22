import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/navbar.component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "@/pages/home.page";
import Login from "@/pages/login.page";
import Register from "@/pages/register.page";
import { LoaderComponent } from "@/components/loader.component";
import { AuthProvider } from "./context/auth.provider";

const AskQuestion = lazy(() => import("@/pages/ask-question.page"));
const QuestionDetail = lazy(() => import("@/pages/question-detail.page"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<LoaderComponent />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
