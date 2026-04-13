import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      if (data.token) localStorage.setItem("token", data.token);
      await fetchUser();
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed"
      };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/signup", userData);
      if (data.token) localStorage.setItem("token", data.token);
      await fetchUser();
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed"
      };
    }
  };

  const guestLogin = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/guest-login");
      if (data.token) localStorage.setItem("token", data.token);
      await fetchUser();
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Guest login failed"
      };
    }
  };

  const updateAuthProfile = async (profileData) => {
    try {
      const { data } = await api.put("/user/profile", profileData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Profile update failed"
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, guestLogin, updateAuthProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
