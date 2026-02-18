"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, setCurrentUser, clearCurrentUser } from "@/lib/auth";

interface User {
  id: string;
  login: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  profileImage?: string;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage on mount
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);

    // Listen for custom auth change events from login/signup pages
    const handleAuthChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };

    window.addEventListener("authchange", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("authchange", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
