import { string, object, type InferType } from "yup";

export const loginSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string().required("Password is required"),
}).required();

export const registerSchema = object({
  username: string()
    .required("Username is required")
    .min(3, "Must be at least 3 characters"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .required("Password is required")
    .min(6, "Must be at least 6 characters"),
}).required();

export type LoginFormData = InferType<typeof loginSchema>;
export type RegisterFormData = InferType<typeof registerSchema>;
