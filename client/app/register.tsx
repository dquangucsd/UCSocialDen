import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import * as ImagePicker from 'expo-image-picker';

const SERVER_PORT = 5002;
const BACKEND_URL = `http://localhost:${SERVER_PORT}`;

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [pid, setPid] = useState("");
    const [bio, setBio] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(String || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async () => {
        if (!name || !major || !pid || !email) {
            alert("All required fields must be filled out.");
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, major, pid, bio, profilePhoto }),
            });
            
            const data = await response.json();
            if (response.ok) {
                router.replace("/login");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePhoto(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Text style={styles.title}>UC Social Den</Text>
            </View>
            <View style={styles.registerContainer}>
                <Text style={styles.subtitle}>Create an Account</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <TextInput 
                    style={styles.input} 
                    placeholder="Full Name" 
                    value={name} 
                    onChangeText={setName} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Major" 
                    value={major} 
                    onChangeText={setMajor} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="PID" 
                    value={pid} 
                    onChangeText={setPid} 
                    keyboardType="numeric"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Bio (Optional)" 
                    value={bio} 
                    onChangeText={setBio} 
                    multiline
                />
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.uploadText}>Upload Profile Photo</Text>
                </TouchableOpacity>
                {profilePhoto && <Text>Photo selected</Text>}
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerText}>Register</Text>
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
    registerContainer: {
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
        marginTop: 100,
        marginBottom: 30,
    },
    input: {
        width: "80%",
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.indigo,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    uploadButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 15,
    },
    uploadText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerButton: {
        backgroundColor: "#4285F4",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    registerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});