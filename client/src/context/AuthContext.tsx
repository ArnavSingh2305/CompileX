
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type UserRole = "user" | "admin" | "teacher";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
}

type LoginUser = Omit<User, "role" | "mustChangePassword"> &
  Partial<Pick<User, "role" | "mustChangePassword">>;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: LoginUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (userData: LoginUser): User => ({
  ...userData,
  role: userData.role ?? "user",
  mustChangePassword: userData.mustChangePassword ?? false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");

    if (!stored) return null;

    try {
      return normalizeUser(JSON.parse(stored) as LoginUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const login = (userData: LoginUser, authToken: string) => {
    const normalizedUser = normalizeUser(userData);

    setUser(normalizedUser);
    setToken(authToken);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
