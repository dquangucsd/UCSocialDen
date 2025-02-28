import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../../utils/constants';
import { useCalendar } from '../../hooks/useCalendar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
const SERVER_PORT = 5002; //process.env.PORT;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width <= 430;

  // Don't render the main sidebar at all if mobile and not open
  if (isMobile && !isOpen) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.toggleText}>☰</Text>
      </TouchableOpacity>
    );
  }

  // fetch user's events from the server
  const [events, setEvents] = useState([]);
  useEffect(() => {
    console.log("Fetching user joined events...");
    async function getEvents() {
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
      const events = await response.json();
      // const sortedEvents = events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

      setEvents(events);
    }
    getEvents();
    return;
  }, [events.length]);

  return (
    <>
      {isMobile && isOpen && (
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}
      
      <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
        <Text style={styles.sidebarTitle}>Your Events</Text>
        {events.map((item, index) => (
          <TouchableOpacity key={index} style={styles.sidebarItem}>
            <Text style={styles.sidebarText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
        
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.sidebarTitle}>Your Calendar</Text>
            <TouchableOpacity style={styles.todayButton}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
          <Calendar />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    width: 280,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    zIndex: 1000,
  },
  toggleButton: {
    position: 'absolute',
    left: 10,
    bottom: '10%',
    backgroundColor: COLORS.indigo,
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  sidebarTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sidebarItem: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    marginVertical: 4,
    borderRadius: 4,
  },
  sidebarText: {
    color: '#111827',
  },
  calendarSection: {
    marginTop: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  todayButton: {
    backgroundColor: COLORS.periwinkle,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  todayButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
  },
}); 