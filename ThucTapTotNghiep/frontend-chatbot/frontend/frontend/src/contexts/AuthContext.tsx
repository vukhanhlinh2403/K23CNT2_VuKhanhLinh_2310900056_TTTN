import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/auth.service";
import type { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  );

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
    } else {
      setIsAuthenticated(true);
      setUser(authService.getUser());
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const result = await authService.login({
      email,
      password,
    });

    setUser(result.user);
    setIsAuthenticated(true);
    return result.user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const role: UserRole = user?.role || (localStorage.getItem("userRole") as UserRole) || "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }

  return context;
}
