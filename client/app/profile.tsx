import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Image } from "react-native";
import { COLORS } from "../utils/constants";
import { useRouter } from "expo-router";
import TopNavBar from "../components/layout/TopNavBar";
import Sidebar from "../components/layout/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; 

const SERVER_PORT = 5002; //process.env.PORT;

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null); // 存储用户数据
  const [joinedEvents, setJoinedEvents] = useState([]);
  useEffect(() => {
    async function fetchProfileImage() {
      const token = await AsyncStorage.getItem("jwt");
      console.log("token:", token);
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log("Decoded Token:", decodedToken);

          // 从后端获取用户详细信息
          const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${decodedToken.email}`);
          if (response.ok) {
            const userDetails = await response.json();
            
            setUserData({
              name: decodedToken.name || "Unknown User",
              email: decodedToken.email || "No Email Provided",
              major: userDetails.major || "Not specified",
              intro: userDetails.self_intro || "No introduction provided",
            });

            if (decodedToken.image) {
              console.log("Profile Image URL:", decodedToken.image);
              setProfileImage(decodedToken.image); 
            } else {
              console.warn("No image found in JWT");
              setProfileImage("https://via.placeholder.com/80"); 
            }
          }
        } catch (error) {
          console.error("Error decoding JWT:", error);
          setProfileImage("https://via.placeholder.com/80");
        }
      }
    }

    async function getJoinedEvents() {
      console.log("Fetching user joined events...");
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        console.warn("No JWT found in AsyncStorage");
        return;
      }
      const decodedToken: any = jwtDecode(token);
      // console.log("Decoded Token:", decodedToken);
      if (!decodedToken.email) {
        console.warn("No email found in JWT");
        return;
      }
      
      const user_ID = decodedToken.email;
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/events/${user_ID}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      // console.log("response:", response);
      const results = await response.json();
      const sortedEvents = results.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

      setJoinedEvents(sortedEvents);
    }
    
    getJoinedEvents()
    fetchProfileImage();
  }, []);
  

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <TopNavBar activeTab="Profile" />

      <View style={styles.mainContent}>
        <Sidebar events={joinedEvents}/>

        {/* Profile Content */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profilePhotoContainer}>
            <Image 
  source={{ uri: profileImage || "https://via.placeholder.com/80" }} 
  style={styles.profilePhoto}
/>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userData?.name || "Name"}</Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>{userData?.tag?.join(", ") || "Tag"}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>{userData?.rating || "Rating"}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>{userData?.number_post || "# Posts"}</Text>
                </View>
              </View>
              <Text style={styles.email}>{userData?.email || "Email"}</Text>
              <Text style={styles.major}>{userData?.major || "Major"}</Text>
              <Text style={styles.selfIntro}>{userData?.intro || "Self Intro"}</Text>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Account Setting</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Reset Passwords</Text>
            </TouchableOpacity>
          </View>
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
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  profileSection: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 30,
  },
  profilePhotoContainer: {
    marginRight: 30,
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#D1D5DB",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  stats: {
    flexDirection: "row",
    marginBottom: 15,
  },
  stat: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
  },
  statLabel: {
    color: "#4B5563",
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  major: {
    fontSize: 16,
    marginBottom: 8,
  },
  selfIntro: {
    fontSize: 16,
    color: "#4B5563",
  },
  settingsSection: {
    backgroundColor: "#E5E7EB",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingItem: {
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
    color: "#4B5563",
  },
});
