import React, { useState, useEffect } from "react";
import {COLORS} from "../utils/constants";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";

const { width, height } = Dimensions.get("window");
const SERVER_PORT = 5002;

interface EventDetailsProps {
  event: {
    _id: string;
    name: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    tags: string;
  }; // Ensure it receives correct event data
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  // if (!event) return null;
  console.log(event.tags);
  // console.log(event.start);
  const [isJoined, setIsJoined] = useState(false);

  const tagPadding = () => {
    if (event.tags && event.tags.length > 0) return 5;
    return 0;
  };

  useEffect(() => {
    const fetchJoinStatus = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (user) {
          const response = await fetch(
            `http://localhost:${SERVER_PORT}/api/users/${event._id}/join_status?userId=${user.user._id}`
          );
          const data = await response.json();
          setIsJoined(data.joined);
        }
      } catch (error) {
        console.error("Error fetching join status:", error);
      }
    };
  
    fetchJoinStatus();
  }, [event._id]);
  

  const handleJoinEvent = async () => {
    // Send a request to join the event
    // If successful, set isJoined to true
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user) {
        console.error("No user found");
        alert("Please log in to join the event."); // DELETE THIS LINE?
        throw new Error("No user found");
        return;
      }

      const response = await fetch(`http://localhost:${SERVER_PORT}/api/users/${event._id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: user.user._id 
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data["message"]);
      }
      
      setIsJoined(true);
      alert("You have joined the event!");
    } catch (error) {
      console.error("Failed to join event:", error);
      alert("Failed to join event. Please try again."); 
    }
  };

  return (
    <Modal visible animationType="none" transparent>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>

            {/* Event Title */}
            <Text style={styles.title}>{event.name || "Unknown Event"}</Text>

            {/* Event Tag */}
            <View>
              <TouchableOpacity style={[styles.eventTag, {paddingHorizontal: tagPadding()}]} disabled>
              <Text style={styles.eventInfo}>
                {event.tags && event.tags.length > 0 ? event.tags : "Unknown"}
              </Text>
              </TouchableOpacity>
            </View>

            {/* Event Location & Time Info */}
            <View style={styles.locationTimeContainer}>
              <Text style={styles.eventInfo}>
                {new Date(event.start_time).toLocaleString("en-US", {
                 month: "short",
                 day: "numeric",
                 hour: "2-digit",
                 minute: "2-digit",
                  })}{" "}
                 -{" "}
                  {new Date(event.end_time).toLocaleString("en-US", {
                   month: "short",
                   day: "numeric",
                   hour: "2-digit",
                   minute: "2-digit",
                   })}
              </Text>
              <Text style={styles.eventInfo}>Location: {event.location || "Unknown Location"}</Text>
            </View>

            {/* Description Box */}
            <View style={styles.descriptionBox}>
              <Text>{event.description || "No description available."}</Text>
            </View>

            {/* Join Button */}
            <TouchableOpacity 
                style={isJoined ? styles.disabledButton : styles.joinButton}
                onPress={handleJoinEvent}
                disabled={isJoined}
            >
              <Text style={styles.buttonText}>{isJoined ? "Joined" : "Join"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    height: "80%", // Set a larger height
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ddd",
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  closeButtonText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1, // Allows proper scrolling
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  locationTimeContainer: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  eventTag: {
    backgroundColor: COLORS.brightSun,
    fontFamily: 'Zain',
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  eventInfo: {
    fontSize: 14,
    color: COLORS.indigo,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionBox: {
    width: "100%",
    backgroundColor: "#f5f0e5",
    borderRadius: 5,
    padding: 10,
    paddingVertical: 30,
    marginBottom: 10,
  },
  joinSection: {
    width: "100%",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "#ddd",
  },
  joinButton: {
    backgroundColor: "#556ebe",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    width: width * 0.8,
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
    width: width * 0.8,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EventDetails;