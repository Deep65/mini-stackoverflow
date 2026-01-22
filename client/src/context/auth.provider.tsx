import { useState, useEffect, useCallback, type ReactNode } from "react";
import api from "@/services/api.service";
import { toast } from "react-toastify";
import type { IUser } from "@/types/types";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Auth check failed", error);
      sessionStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await fetchUserDetails();
      setLoading(false);
    };
    initAuth();
  }, [fetchUserDetails]);

  const login = (token: string, userData: IUser) => {
    sessionStorage.setItem("token", token);
    setUser(userData);
    toast.success("Logged in successfully!");
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser: fetchUserDetails,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
