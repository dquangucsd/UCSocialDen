import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_PORT = 5002;
const BACKEND_URL = `http://localhost:${SERVER_PORT}`;

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const token = await AsyncStorage.getItem("jwt");
            if (token) {
                router.replace("/HomeScreen");
            } else {
                setLoading(false); 
            }
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
            <Text style={styles.title}>Welcome to UC Social Den</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={handleGoogleLogin}>
                    <Text style={styles.loginText}>Login with Google</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
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
