import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_PORT = 5002;
const BACKEND_URL = `http://localhost:${SERVER_PORT}`;

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            // const token = await AsyncStorage.getItem("jwt");
            // if (token) {
            //     router.replace("/HomeScreen");
            // } else {
            //     setLoading(false); 
            // }
            await AsyncStorage.removeItem("jwt");
            await AsyncStorage.removeItem("user");
            setLoading(false);
        }

        checkAuth();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            window.location.href = `${BACKEND_URL}/auth/google`;
        } catch (error) {
            console.error("Fail:", error);
        }
    };

    return (
        <View style={styles.container}>
             <View style={styles.navbar}>
                <Text style={styles.title}>UC Social Den</Text>
            </View>
            <View style={styles.LoginContainer}>
                
                <Text style={styles.subtitle}>Welcome to UC Social Den</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={handleGoogleLogin}>
                        <Text style={styles.loginText}>Login with UCSD Email</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.alabaster,
    },
    LoginContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.alabaster,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.indigo,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
        fontFamily: 'Zain',
    },
    subtitle: {
        color: COLORS.indigo,
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Zain',
        marginTop: 200,
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
