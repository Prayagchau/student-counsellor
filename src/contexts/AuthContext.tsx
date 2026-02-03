import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";

export type UserRole = "student" | "user" | "counsellor" | "admin";

export interface User {
  id: string;
  name: string;
  fullName?: string; // Alias for name for backward compatibility
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're in development mode without backend
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const storedSession = localStorage.getItem("eduguide_session") || sessionStorage.getItem("eduguide_session");
      if (storedSession) {
        try {
          const sessionData = JSON.parse(storedSession);
          
          // If using real API, verify token is still valid
          if (!USE_MOCK_AUTH && sessionData.token) {
            const response = await authApi.getProfile();
            if (response.success && response.data?.user) {
              const userData = response.data.user as User;
              setUser(userData);
            } else {
              // Token expired, clear session
              localStorage.removeItem("eduguide_session");
              sessionStorage.removeItem("eduguide_session");
            }
          } else {
            // Mock mode or no token
            setUser(sessionData.user);
          }
        } catch {
          localStorage.removeItem("eduguide_session");
          sessionStorage.removeItem("eduguide_session");
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const refreshProfile = async () => {
    if (USE_MOCK_AUTH) return;
    
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data?.user) {
        setUser(response.data.user as User);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (!response.success) {
        setIsLoading(false);
        return { success: false, error: response.message };
      }

      const { user: userData, token } = response.data as { user: User; token: string };
      
      // Map 'user' role to 'student' for frontend compatibility
      const normalizedUser: User = {
        ...userData,
        fullName: userData.name, // Add fullName alias
        role: userData.role === 'user' ? 'student' : userData.role,
      };

      const sessionData = { user: normalizedUser, token, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };

      if (rememberMe) {
        localStorage.setItem("eduguide_session", JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem("eduguide_session", JSON.stringify(sessionData));
      }

      setUser(normalizedUser);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const signup = async (fullName: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Map frontend 'student' role to backend 'user' role
      const backendRole = role === 'student' ? 'user' : role;
      
      const response = await authApi.signup({
        name: fullName,
        email,
        password,
        role: backendRole,
      });

      if (!response.success) {
        setIsLoading(false);
        return { success: false, error: response.message };
      }

      const { user: userData, token } = response.data as { user: User; token: string };
      
      // Map 'user' role to 'student' for frontend compatibility
      const normalizedUser: User = {
        ...userData,
        fullName: userData.name, // Add fullName alias
        role: userData.role === 'user' ? 'student' : userData.role,
      };

      const sessionData = { user: normalizedUser, token, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
      sessionStorage.setItem("eduguide_session", JSON.stringify(sessionData));

      setUser(normalizedUser);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Signup failed. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("eduguide_session");
    sessionStorage.removeItem("eduguide_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
