import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { COLORS } from '../utils/constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import TopNavBar from "../components/layout/TopNavBar";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import * as ImagePicker from 'expo-image-picker';

const SERVER_PORT = 5002;

// set uri to binary file
const convertUriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const [major, setMajor] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUserData } = useContext(AuthContext) || {};
  
  useEffect(() => {
    const fetchUserData = async () => {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      
      //const token = await AsyncStorage.getItem("jwt");
      //console.log("Major field:", user?.user?.major);
      // if (!userString) {
      //   console.error("User not found in AsyncStorage");
      //   return;
      // }
      if (!userString) {
        router.replace("/login");
        return;
      }
      //console.log(user.profile_photo);
      try {
        //const decodedToken: any = jwtDecode(token);
        //const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${decodedToken.email}`);
        
        //if (response.ok) {
          //const userDetails = await response.json();
          setMajor(user.user.major|| "");
          setBio(user.user.intro || "");
          setProfileImage(user.user.profile_photo || null);
        //}
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("Selected image:", result.assets[0]);
      setSelectedImage(result.assets[0].uri);
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      //const token = await AsyncStorage.getItem("jwt");
      if (!user) throw new Error("No token found");

      //const decodedToken: any = jwtDecode(token);
      
      // there is image
      if (selectedImage) {        
        const imageFormData = new FormData();
        const imageBlob = await convertUriToBlob(selectedImage);
        imageFormData.append("profilePhoto", imageBlob, "profile.jpg");

        console.log("Uploading image:", imageFormData);
        const imageResponse = await fetch(`http://localhost:${SERVER_PORT}/api/users/profile_photo/${user.user._id}`, {
          method: "PUT",
          body: imageFormData
        });
        
        if (!imageResponse.ok) {
          console.error("Failed to update profile image");
        }
        else{
          const imageData = await imageResponse.json();
          if (imageData.success &&imageData.user && imageData.user.profile_photo){
              user.user.profile_photo = imageData.user.profile_photo;
          }
        }
      }
      
      // update user info
      const introResponse = await fetch(`http://localhost:${SERVER_PORT}/api/users/${user.user._id}/intro`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intro: bio,
          major: major
        })
      });
      
      if (!introResponse.ok) {
        const errorText = await introResponse.text();
        console.error("Failed to update profile:", errorText);
        throw new Error(`Failed to update profile information: ${errorText}`);
      }
      // update local storage

      user.user.major = major;
      user.user.intro = bio;
      // const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/image/${user.user._id}`);
      // if (!response){
      //   console.log("error, no image response");
      // }

      // const data = await response.json();
      //console.log(data.profile_photo);
      //user.user.profileImage = data.profile_photo;

      // const userString = await AsyncStorage.getItem("user");
      // const user = userString ? JSON.parse(userString) : null;
      // user.user.major = major;
      // user.user.intro = bio;
      // const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/image/${email}`);
      // user.user.profileImage = 
      await AsyncStorage.setItem("user", JSON.stringify(user));
      if (updateUserData) {
        updateUserData({
          ...user.user,
          profile_photo: user.user.profile_photo
        });
      }
      console.log("user", JSON.stringify(user));
      console.log("Profile updated successfully");
      //Redirect()
      //router.back();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TopNavBar activeTab="Profile" />

      <View style={styles.editContainer}>
        <Text style={styles.subtitle}>Edit Profile</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: profileImage || "https://via.placeholder.com/120" }} 
            style={styles.profilePhoto} 
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.indigo} />
          ) : (
            <TouchableOpacity style={styles.updateButton} onPress={async () => {
              await handleUpdate(); 
              router.push("/profile");
            }}>
              <Text style={styles.updateText}>Update Profile</Text>
            </TouchableOpacity>
          )}
        </View>
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
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
  uploadButton: {
    backgroundColor: COLORS.periwinkle,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: COLORS.indigo,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  updateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});