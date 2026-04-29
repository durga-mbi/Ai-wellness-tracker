import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await api.get("/auth/me");
      
      // Manual Patch for Location
      const fetchedUser = data.user;
      if (fetchedUser && !fetchedUser.location && fetchedUser.preferences) {
          try {
              const prefs = JSON.parse(fetchedUser.preferences);
              if (prefs.location) fetchedUser.location = prefs.location;
          } catch (e) {}
      }
      
      setUser(fetchedUser);
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Fetch user error:", err);
      }
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
      const message = err.response?.data?.message;
      return {
        success: false,
        message: message === "User not found"
          ? "We couldn't find an account with those details. Please double-check or sign up."
          : message === "Invalid credentials"
            ? "The password you entered doesn't seem quite right. Please try again."
            : message || "We're having a bit of trouble connecting to the sanctuary. Please try again in a moment."
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
      const message = err.response?.data?.message;
      return {
        success: false,
        message: message === "User already exists"
          ? "It looks like you've already started your journey with us! Try logging in instead."
          : message || "We encountered a small storm creating your space. Please check your details and try again."
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
        message: "The guest entrance is currently closed for a moment of peace. Please try again shortly."
      };
    }
  };

  const updateAuthProfile = async (profileData) => {
    try {
      
      // Force Merge Location into Preferences for absolute reliability
      const currentPrefs = user?.preferences ? (typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences) : {};
      const newLocation = profileData.location || currentPrefs.location || user?.location;
      
      const mergedProfile = {
        ...profileData,
        preferences: {
          ...(typeof profileData.preferences === 'object' ? profileData.preferences : (profileData.preferences ? JSON.parse(profileData.preferences) : {})),
          ...currentPrefs,
          location: newLocation
        }
      };

      const { data } = await api.put("/user/profile", mergedProfile);
      
      const updatedUser = data.user;
      if (updatedUser && !updatedUser.location && updatedUser.preferences) {
          try {
              const prefs = JSON.parse(updatedUser.preferences);
              if (prefs.location) updatedUser.location = prefs.location;
          } catch (e) {}
      }

      setUser(updatedUser);
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
