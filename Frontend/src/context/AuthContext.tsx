import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { IUser } from "../services/Interface";

type AuthContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredUser = (): IUser | null => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 🔥 QUAN TRỌNG: lấy user từ localStorage
    const rawUser = localStorage.getItem("user");

    if (rawUser) {
      try {
        const storedUser: IUser = JSON.parse(rawUser);
        setUser(storedUser); // ✅ có role, userId, cartId
      } catch {
        setUser(null);
      }
    } else {
      // có token nhưng không có user → coi như chưa login
      setUser(null);
    }

    setLoading(false);
  }, []);


  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("cartId");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
