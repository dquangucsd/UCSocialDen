import React, { useState } from "react";
import {COLORS} from "../utils/constants";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
    participants: string[];
    author: string;
    image?: string;
    tags: string;
    current_joined: number;
    participant_limit: number;
    version: number;
  }; // Ensure it receives correct event data
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  // if (!event) return null;

  // console.log(event.start);
  const [isJoined, setIsJoined] = useState(false);
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
            <View style={styles.eventTag}>
              <Text style={styles.eventInfo}>{event.tags && event.tags.length > 0 ? event.tags : "Unknown"}</Text>
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

            {/* Event Image */}
            {event.image && (
              <Image source={{ uri: event.image }} style={styles.eventImage} />
            )}

            {/* Description Box */}
            <View style={styles.descriptionBox}>
              <Text>{event.description || "No description available."}</Text>
            </View>

            {/* Joined People Section */}
            {/* <View style={styles.joinSection}>
              <Text style={styles.label}>Joined people</Text>
              <View style={styles.profileContainer}>
                {joinedPeople.map((person) => (
                  <Image key={person.id} source={{ uri: person.avatar || "https://via.placeholder.com/50"}} style={styles.profileCircle} />
                ))}
              </View>
            </View> */}

            {/* Join Button */}
            <TouchableOpacity 
                // style={isJoined ? styles.joinButton : styles.disabledButton}
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
  eventImage: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationTimeContainer: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  eventTag: {
    backgroundColor: COLORS.brightSun,
    paddingVertical: 2,
    fontFamily: 'Zain',
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  eventInfo: {
    fontSize: 14,
    color: "#777",
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
