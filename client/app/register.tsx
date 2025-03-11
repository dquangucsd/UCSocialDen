import React, { useEffect, useState } from "react";
import { Platform, } from "react-native";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import  { jwtDecode , JwtPayload } from "jwt-decode";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

const SERVER_PORT = 5002;
const BACKEND_URL = `http://localhost:${SERVER_PORT}`;

// set uri to binary file
const convertUriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
};
interface CustomJwtPayload extends JwtPayload {
    email: string;
    name: {
        familyName: string;
        givenName: string;
    };
}

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [major, setMajor] = useState("");
    const [bio, setBio] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        // get Name and email from jwt.
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem("jwt");
            if (!token){
                console.error("No token");
                router.replace("/login");
                return;
            }
            const decoded = jwtDecode<CustomJwtPayload>(token);
            console.log("Decoded JWT:", decoded);
            setEmail(decoded.email || "");
            const fullName = `${decoded.name.givenName} ${decoded.name.familyName}`;
            setName(fullName);
        };
        fetchUserData();
    }, []);
    // select image 
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
    
        if (!result.canceled && result.assets?.length > 0) {
            let imageUri = result.assets[0].uri;
    
            // different platform have different upload method
            if (Platform.OS !== "web") {
                try {
                    const info = await FileSystem.getInfoAsync(imageUri);
                    // auto decrease the size of the image
                    if (info.exists && info.size > 500 * 1024) {
                        console.log("Image too large, compressing...");
                        const compressedImage = await ImageManipulator.manipulateAsync(
                            imageUri,
                            [{ resize: { width: 800 } }],
                            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                        );
                        imageUri = compressedImage.uri;
                    }
                } catch (error) {
                    console.error("Error getting file info:", error);
                }
            } else {
                console.log("Skipping size check on web");
            }
    
            setProfilePhoto(imageUri);
        } else {
            console.log("User cancelled image picker");
        }
    };
    // main function of register in frontend -> the button action
    const handleRegister = async () => {
        if ( !major || !profilePhoto) {
            alert("All required fields must be filled out.");
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            // collect all information into FormData instead of pass JSON to backend -> JSON too large.
            let formData = new FormData();
            formData.append("email", email);
            formData.append("name", name);
            formData.append("major", major);
            formData.append("bio", bio);
            const imageBlob = await convertUriToBlob(profilePhoto);

            formData.append("profilePhoto", imageBlob, "profile.jpg");
            // fetch backend api
            const response = await fetch(`${BACKEND_URL}/api/users/register`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Registration successful:", data);
                router.replace("/login");
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Something went wrong. Please try again.", error);
            setError("Error uploading image or registering.");
        } finally {
            setLoading(false);
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
                {/* <TextInput 
                    style={styles.input} 
                    placeholder="Full Name" 
                    value={name} 
                    onChangeText={setName} 
                /> */}
                <TextInput 
                    style={styles.input} 
                    placeholder="Major" 
                    value={major} 
                    onChangeText={setMajor} 
                />
                {/* <TextInput 
                    style={styles.input} 
                    placeholder="PID" 
                    value={pid} 
                    onChangeText={setPid} 
                    keyboardType="numeric"
                /> */}
                {/* <TextInput 
                    style={styles.input} 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address"
                /> */}
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