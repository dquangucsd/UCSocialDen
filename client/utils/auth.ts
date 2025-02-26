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
