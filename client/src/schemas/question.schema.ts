import { object, string } from "yup";

export const questionSchema = object({
  title: string()
    .required("Title is required")
    .min(10, "Title must be at least 10 characters"),

  content: string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters"),

  tags: string().required("At least 1 tag should be there"),
});
