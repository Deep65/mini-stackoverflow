import { useCallback, useEffect, useState } from "react";
import api from "@/services/api.service";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { ICommentFormData, IComment } from "@/types/types";
import { VoteTargetType } from "@/enums";
import { useAuth } from "@/hooks/use-auth.hook";

interface CommentsProps {
  targetId: string;
  targetType: VoteTargetType;
}

const Comments = ({ targetId, targetType }: CommentsProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const { isAuthenticated } = useAuth();
  const { register, handleSubmit, reset } = useForm<ICommentFormData>();
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/${targetId}`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, targetId]);

  const onSubmit = async (data: ICommentFormData) => {
    if (!isAuthenticated) return toast.error("Please login to comment");
    try {
      await api.post("/comments", {
        content: data.content,
        targetId,
        targetType,
      });
      toast.success("Comment added");
      reset();
      fetchComments();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to add comment");
      } else {
        toast.error("Failed to add comment");
      }
    }
  };

  return (
    <div className="mt-4 border-t pt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-700 mb-2"
      >
        <MessageCircle className="h-4 w-4" />
        {comments.length} Comments
      </button>

      {isExpanded && (
        <div className="pl-4 border-l-2 border-gray-100 space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="text-sm">
              <span className="text-gray-700">{comment.content}</span>
              <span className="text-blue-600 ml-2 font-medium text-xs">
                – {comment.author.username}
              </span>
            </div>
          ))}

          {isAuthenticated ? (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 text-sm border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                {...register("content", { required: true })}
              />
              <button
                type="submit"
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
              >
                Add
              </button>
            </form>
          ) : (
            <p className="text-xs text-gray-400 italic">Login to comment</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
