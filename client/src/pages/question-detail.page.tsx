import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api.service";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ArrowBigUp, ArrowBigDown, User } from "lucide-react";
import Comments from "@/components/comments.component";
import { AxiosError } from "axios";
import type { IQuestion } from "@/types/types";
import { VoteTargetType, VoteValue } from "@/enums";
import { useAuth } from "@/hooks/use-auth.hook";

interface AnswerFormData {
  content: string;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const { isAuthenticated, refreshUser } = useAuth();
  const { register, handleSubmit, reset } = useForm<AnswerFormData>();

  const fetchQuestion = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleVote = async (
    targetId: string,
    targetType: VoteTargetType,
    value: VoteValue,
  ) => {
    if (!isAuthenticated) return toast.error("Please login to vote");

    try {
      const endpoint =
        targetType === VoteTargetType.Question
          ? `/questions/${targetId}/vote`
          : `/answers/${targetId}/vote`;

      await api.post(endpoint, { value });
      await fetchQuestion();
      refreshUser();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Vote failed");
      } else {
        toast.error("Vote failed");
      }
    }
  };

  const onAnswerSubmit = async (data: AnswerFormData) => {
    if (!isAuthenticated) return toast.error("Please login to answer");

    try {
      await api.post(`/questions/${id}/answers`, data);
      toast.success("Answer posted");
      reset();
      await fetchQuestion();
      refreshUser();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to post answer");
      } else {
        toast.error("Failed to post answer");
      }
    }
  };

  if (!question) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Question Section */}
      <div className="flex gap-4 mb-8">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() =>
              handleVote(
                question._id,
                VoteTargetType.Question,
                VoteValue.Upvote,
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-orange-500"
          >
            <ArrowBigUp className="h-8 w-8" />
          </button>
          <span className="text-xl font-bold font-mono">
            {(question.upvotes?.length || 0) -
              (question.downvotes?.length || 0)}
          </span>
          <button
            onClick={() =>
              handleVote(
                question._id,
                VoteTargetType.Question,
                VoteValue.Downvote,
              )
            }
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-orange-500"
          >
            <ArrowBigDown className="h-8 w-8" />
          </button>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-200 mb-4">
            <p className="whitespace-pre-wrap">{question.content}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {question.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <User className="h-4 w-4" />
              <span className="font-semibold">{question.author?.username}</span>
              <span className="text-xs">
                ({question.author?.reputation} rep)
              </span>
            </div>
          </div>
          <Comments
            targetId={question._id}
            targetType={VoteTargetType.Question}
          />
        </div>
      </div>

      {/* Answers Section */}
      <h2 className="text-2xl font-bold mb-6">
        {question.answers?.length} Answers
      </h2>

      <div className="space-y-6 mb-10">
        {question.answers?.map((answer) => (
          <div
            key={answer._id}
            className="flex gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() =>
                  handleVote(
                    answer._id,
                    VoteTargetType.Answer,
                    VoteValue.Upvote,
                  )
                }
                className="p-1 hover:text-orange-500 text-gray-400"
              >
                <ArrowBigUp className="h-6 w-6" />
              </button>
              <span className="font-bold text-gray-700">
                {(answer.upvotes?.length || 0) -
                  (answer.downvotes?.length || 0)}
              </span>
              <button
                onClick={() =>
                  handleVote(
                    answer._id,
                    VoteTargetType.Answer,
                    VoteValue.Downvote,
                  )
                }
                className="p-1 hover:text-orange-500 text-gray-400"
              >
                <ArrowBigDown className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1">
              <p className="whitespace-pre-wrap mb-4">{answer.content}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
                <span>Answered by</span>
                <span className="font-medium text-gray-900">
                  {answer.author?.username}
                </span>
                <span>({answer.author?.reputation} rep)</span>
              </div>
              <Comments
                targetId={answer._id}
                targetType={VoteTargetType.Answer}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Your Answer</h3>
        <form onSubmit={handleSubmit(onAnswerSubmit)}>
          <textarea
            className="input-field mb-4 min-h-[150px]"
            placeholder="Write your answer..."
            {...register("content", { required: true })}
          />
          <button type="submit" className="btn btn-primary">
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetail;
