import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import TopNavBar from "../components/layout/TopNavBar";

const SERVER_PORT = 5002;

export default function EditProfileScreen() {
  const router = useRouter();
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${decodedToken.email}`);
        
        if (response.ok) {
          const userDetails = await response.json();
          setMajor(userDetails.major || "");
          setBio(userDetails.self_intro || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem("jwt");
      if (!token) throw new Error("No token found");

      const decodedToken: any = jwtDecode(token);
      
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${decodedToken.email}/intro`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          major: major,
          self_intro: bio
        })
      });

      console.log("Update response status:", response.status);
      
      if (response.ok) {
        router.back();
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopNavBar activeTab="Profile" />

      <View style={styles.editContainer}>
        <Text style={styles.subtitle}>Edit Profile</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Major"
          value={major}
          onChangeText={setMajor}
        />

        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="About Me"
          value={bio}
          onChangeText={setBio}
          multiline
        />

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.indigo} />
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateText}>Update Profile</Text>
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
  editContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.indigo,
  },
  input: {
    width: '80%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.indigo,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: COLORS.indigo,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  updateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
}); 