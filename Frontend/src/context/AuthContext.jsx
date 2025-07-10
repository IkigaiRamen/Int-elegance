import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = jwtDecode(token);
      return decodedToken.id;
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    if (!id) {
      setError("Invalid or missing token");
    } else {
      setUserId(id);
    }
  }, []);

  // Provide userId and error globally
  return (
    <AuthContext.Provider value={{ userId, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
