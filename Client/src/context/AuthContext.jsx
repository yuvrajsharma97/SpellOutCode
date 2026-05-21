import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const register = async (payload) => {
    const response = await authApi.register(payload);

    setUser(response?.data?.user || null);

    return response;
  };

  const login = async (payload) => {
    const response = await authApi.login(payload);

    setUser(response?.data?.user || null);

    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      register,
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
