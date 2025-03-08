import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video,ResizeMode  } from "expo-av";

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
        <ImageBackground
            source={require("../assets/images/login.png")}  
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay} pointerEvents="none" />

            <View style={styles.content}>
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)",  
        zIndex: 1,
    },
    content: {
        flex: 1,
        position: "relative",
        zIndex: 2,
    },
    LoginContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.indigo,
        zIndex: 2,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
        fontFamily: 'Zain',
        zIndex: 2,
    },
    subtitle: {
        color: "white",
        fontSize: 50,
        fontWeight: 'bold',
        fontFamily: 'Zain',
        marginTop: 200,
        marginBottom: 30,
        zIndex: 2,
    },
    loginButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        zIndex: 2,
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        zIndex: 2,
    },

});
