import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/services/api.service";
import QuestionCard from "@/components/question-card.component";
import { Loader } from "lucide-react";
import type { IQuestion } from "@/types/types";

const Home = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";
      const res = await api.get(`/questions?search=${search}`);
      setQuestions(res.data);
    } catch (error: unknown) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Top Questions</h1>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No questions found. Be the first to ask!
        </div>
      ) : (
        questions.map((q) => <QuestionCard key={q._id} question={q} />)
      )}
    </div>
  );
};

export default Home;
