import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchMe = async () => {
    try {
      const response = await authApi.me();

      // axios interceptor returns response.data
      // backend shape:
      // { success, data: { user } }

      setUser(response?.data?.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // Cached queries (my projects, drafts) belong to whoever was signed in.
  // Drop them whenever the signed-in user changes so the next account on
  // this tab never sees them.
  const startSession = (nextUser) => {
    queryClient.clear();
    setUser(nextUser || null);
  };

  // Sign-up only creates a pending account; the session starts after the
  // emailed link is confirmed (see verifyEmail).
  const register = async (payload) => authApi.register(payload);

  const verifyEmail = async (token, payload) => {
    const response = await authApi.verifyEmail(token, payload);
    startSession(response?.data?.user);
    return response;
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);
    startSession(response?.data?.user);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      startSession(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      register,
      verifyEmail,
      login,
      logout,
      fetchMe,
      isAuthenticated: !!user,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
