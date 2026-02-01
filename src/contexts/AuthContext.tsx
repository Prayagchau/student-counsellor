import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "counsellor";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulate password hashing (in production, use bcrypt on backend)
const hashPassword = (password: string): string => {
  return btoa(password + "_salt_eduguide");
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface StoredUser extends User {
  passwordHash: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedSession = localStorage.getItem("eduguide_session") || sessionStorage.getItem("eduguide_session");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData.user);
      } catch {
        localStorage.removeItem("eduguide_session");
        sessionStorage.removeItem("eduguide_session");
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    const usersData = localStorage.getItem("eduguide_users");
    return usersData ? JSON.parse(usersData) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("eduguide_users", JSON.stringify(users));
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: "No account found with this email address" };
    }

    if (!verifyPassword(password, foundUser.passwordHash)) {
      setIsLoading(false);
      return { success: false, error: "Incorrect password. Please try again" };
    }

    const { passwordHash, ...userWithoutPassword } = foundUser;
    const sessionData = { user: userWithoutPassword, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };

    if (rememberMe) {
      localStorage.setItem("eduguide_session", JSON.stringify(sessionData));
    } else {
      sessionStorage.setItem("eduguide_session", JSON.stringify(sessionData));
    }

    setUser(userWithoutPassword);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (fullName: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: StoredUser = {
      id: generateId(),
      fullName,
      email: email.toLowerCase(),
      role,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after signup
    const { passwordHash, ...userWithoutPassword } = newUser;
    const sessionData = { user: userWithoutPassword, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
    sessionStorage.setItem("eduguide_session", JSON.stringify(sessionData));
    
    setUser(userWithoutPassword);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("eduguide_session");
    sessionStorage.removeItem("eduguide_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
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
