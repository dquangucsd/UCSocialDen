import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('jwt', token);
    } catch (error) {
        console.error('Error storing JWT:', error);
    }
};


export async function getToken() {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (error) {
        console.error("Failed to get token:", error);
        return null;
    }
}


export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('jwt');
    } catch (error) {
        console.error('Error removing JWT:', error);
    }
};

import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return false;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp < currentTime) {
      // when JWT expired, clear storage
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("user");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};