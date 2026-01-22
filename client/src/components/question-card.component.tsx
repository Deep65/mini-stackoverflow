import { Link } from "react-router-dom";
import { MessageSquare, ArrowBigUp } from "lucide-react";

import type { IQuestion } from "@/types/types";

interface QuestionCardProps {
  question: IQuestion;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Link
      to={`/questions/${question._id}`}
      className="block card mb-4 hover:shadow-md transition-shadow no-underline text-inherit"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-primary-600 hover:text-primary-800 mb-2">
            {question.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {question.content.substring(0, 200)}...
          </p>
          <div className="flex items-center gap-2 mb-3">
            {question.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ArrowBigUp className="h-4 w-4" />
            {question.upvotes?.length - question.downvotes?.length || 0} votes
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {question.answers?.length || 0} answers
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Asked by{" "}
          <span className="font-medium text-gray-900">
            {question.author?.username || "Unknown"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
