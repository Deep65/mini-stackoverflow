import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import api from "@/services/api.service";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { questionSchema } from "@/schemas/question.schema";
import type { QuestionFormData } from "@/types/types";

const AskQuestion = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>({
    resolver: yupResolver(questionSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const formattedTags = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];
      await api.post("/questions", { ...data, tags: formattedTags });
      toast.success("Question posted successfully!");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to post question");
      } else {
        toast.error("Failed to post question");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ask a Public Question</h1>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Title
            </label>

            <input
              id="title"
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Body
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Include all the information someone would need to answer your
              question.
            </p>
            <textarea
              id="content"
              rows={8}
              className={`input-field ${errors.content ? "border-red-500" : ""}`}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Tags
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Add tags to describe what your question is about (comma
              separated).
            </p>
            <input
              id="tags"
              className="input-field"
              placeholder="e.g. javascript, react, mongodb"
              {...register("tags")}
            />

            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
