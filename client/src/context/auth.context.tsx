import { createContext } from "react";
import type { IAuthContextType } from "@/types/types";

export const AuthContext = createContext<IAuthContextType | undefined>(
  undefined,
);
