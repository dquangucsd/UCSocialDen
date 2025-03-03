import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  userData: any;
  profileImage: string | null;
  //login: (token: string, user: any) => Promise<void>;
  //logout: () => Promise<void>;
  updateUserData: (userData: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {

    const checkAuth = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        setIsAuthenticated(true);
        setUserData(user.user);
        setProfileImage(user.user.profile_photo || null);
      }
    };

    checkAuth();
  }, []);

  // const login = async (token: string, user: any) => {
  //   await AsyncStorage.setItem('jwt', token);
  //   await AsyncStorage.setItem('user', JSON.stringify(user));
  //   setIsAuthenticated(true);
  //   setUserData(user.user);
  //   setProfileImage(user.user.profile_photo || null);
  // };

  // const logout = async () => {
  //   await AsyncStorage.removeItem('jwt');
  //   await AsyncStorage.removeItem('user');
  //   setIsAuthenticated(false);
  //   setUserData(null);
  //   setProfileImage(null);
  // };

  const updateUserData = async (newUserData: any) => {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      user.user = { ...user.user, ...newUserData };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUserData(user.user);
      setProfileImage(user.user.profile_photo || null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userData, 
      profileImage,
      // login, 
      // logout,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};