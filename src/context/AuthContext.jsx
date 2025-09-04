import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("user")
  );
  const navigate = useNavigate();
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("token", response.data.data.token);
      setUser(response.data.data);
      setIsAuthenticated(true);
      navigate("/tasks");
    } catch (error) {
      throw new Error("Registration failed: " + error.response.data.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });

      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("token", response.data.data.token);
      setUser(response.data.data);
      setIsAuthenticated(true);
      navigate("/tasks");
    } catch (error) {
      throw new Error("Login failed: " + error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated }}
    >
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
