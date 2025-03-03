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
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      //const token = await AsyncStorage.getItem("jwt");
      //console.log("token:", token);
      if (user) {
        try {
          //const decodedToken: any = jwtDecode(token);
          //console.log("Decoded Token:", decodedToken);

          //const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${decodedToken.email}`);
          //if (response.ok) {
            //const userDetails = await response.json();
            
            setUserData({
              name: user.user.name || "Unknown User",
              email: user.user._id || "No Email Provided",
              major: user.user.major || "Not specified",
              intro: user.user.self_intro || "No introduction provided",
            });

            if (user.user.profile_photo) {
              //console.log("Profile Image URL:", decodedToken.image);
              setProfileImage(user.user.profile_photo); 
            } else {
              console.warn("No image found in JWT");
              setProfileImage("https://via.placeholder.com/80"); 
            }
          //}
        } catch (error) {
          console.error("Error", error);
          setProfileImage("https://via.placeholder.com/80");
        }
      }
    }

    async function getJoinedEvents() {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      // console.log("Fetching user joined events...");
      // const token = await AsyncStorage.getItem("jwt");
      // if (!token) {
      //   console.warn("No JWT found in AsyncStorage");
      //   return;
      // }
      // const decodedToken: any = jwtDecode(token);
      // // console.log("Decoded Token:", decodedToken);
      // if (!decodedToken.email) {
      //   console.warn("No email found in JWT");
      //   return;
      // }
      
      // const user_ID = decodedToken.email;
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/events/${user.user._id}`);

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
        <View style={styles.contentContainer}>
          <ScrollView style={styles.profileSection}>
            <View style={styles.profileContent}>
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: profileImage || "https://via.placeholder.com/300" }} 
                  style={styles.profilePhoto} 
                />
              </View>
              
              <Text style={styles.name}>{userData?.name || "Name"}</Text>
              
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{userData?.email || "Email"}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Major:</Text>
                  <Text style={styles.infoValue}>{userData?.major || "Major"}</Text>
                </View>
                
                <View style={styles.bioContainer}>
                  <Text style={styles.bioLabel}>About Me:</Text>
                  <Text style={styles.bioText}>{userData?.intro || "No introduction provided"}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          {/* Edit Profile Button at the bottom */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/edit-profile')}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
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
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  profileSection: {
    flex: 1,
  },
  profileContent: {
    padding: 20,
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePhoto: {
    width: 250,
    height: 250,
    borderRadius: 150,
    backgroundColor: "#D1D5DB",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: COLORS.indigo,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.indigo,
  },
  infoValue: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
  },
  bioContainer: {
    marginTop: 10,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.indigo,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 18,
    color: '#000000',
    lineHeight: 26,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: COLORS.indigo,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    width: '100%',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
