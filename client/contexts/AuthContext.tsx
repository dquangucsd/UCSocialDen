import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
  userData: any;
  profileImage: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const token = await AsyncStorage.getItem("jwt");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          setUserData(decodedToken);
          setProfileImage(decodedToken.image || "https://via.placeholder.com/80");
        } catch (error) {
          console.error("Error decoding JWT:", error);
        }
      }
    }
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, profileImage }}>
      {children}
    </AuthContext.Provider>
  );
};
