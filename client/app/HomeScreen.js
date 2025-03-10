import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Modal, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS, MOCK_EVENTS } from '../utils/constants';
import { useCalendar } from '../hooks/useCalendar';
import { useRouter } from 'expo-router';
import TopNavBar from '../components/layout/TopNavBar';
import Sidebar from '../components/layout/Sidebar';
import CreateEventForm from '../components/CreateEventForm';
import EventCard from '../components/EventCard';
import EventDetails from '../components/EventDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../utils/auth';
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const SERVER_PORT = 5002;
const TAGS = ["All", "Music", "Art", "Sports", "Food", "Networking"];
export default function HomeScreen() {
  const { userData, profileImage } = useContext(AuthContext);
  const router = useRouter();
  const {
    currentMonth,
    selectedDate,
    markedDates,
    calendarRef,
    setCurrentMonth,
    setSelectedDate,
    goToToday,
  } = useCalendar(MOCK_EVENTS);
  
  const [events, setEvents] = useState([]);
  const [isCreateEventFormVisible, setIsCreateEventFormVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [showTags, setShowTags] = useState(false);
  // Today
  const [selectedFilter, setSelectedFilter] = useState("Today");

  useEffect(() => {
    async function fetchAuth() {
      try {
        const response = await fetch("http://localhost:5002/auth/google/callback", {
            method: "GET",
            credentials: "include", 
        });
        console.log(0);
        if (!response.ok) {
            console.error("Login failed:", response.statusText);
            return;
        }
        const data = await response.json();
        console.log("Token received:", data.token);
        await AsyncStorage.setItem("jwt", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/HomeScreen");
      } catch (error) {
        console.error("Error fetching auth:", error);
      }
    }
  
    async function getEvents() {
      console.log("Fetching all events...");
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/events`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const events = await response.json();
      const sortedEvents = events.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setEvents(sortedEvents);
    }

    async function getJoinedEvents() {
      console.log("Fetching user joined events...");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!userString) {
        console.warn("No user found in AsyncStorage");
        return;
      }
      const user_ID = user.user._id;
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/events/${user_ID}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const results = await response.json();
      const sortedEvents = results.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setJoinedEvents(sortedEvents);
    }

    fetchAuth();
    getEvents();
    getJoinedEvents();
    return;
  }, [events.length]);

  const handleEventCreated = (newEvent) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
    setJoinedEvents(prevEvents => [newEvent, ...prevEvents].sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));
  };

  // return events that match the selected filter
  const filterEvents = () => {
    if (selectedFilter === "Today") {
      const today = new Date();
      return events.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.getFullYear() === today.getFullYear() &&
               eventDate.getMonth() === today.getMonth() &&
               eventDate.getDate() === today.getDate();
      });
    } else if (selectedFilter === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return events.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.getFullYear() === tomorrow.getFullYear() &&
               eventDate.getMonth() === tomorrow.getMonth() &&
               eventDate.getDate() === tomorrow.getDate();
      });
    } else if (selectedFilter === "Filter") {
      if (selectedTag === "All") return events;
      return events.filter(event => event.tags && event.tags.includes(selectedTag));
    } else if (selectedFilter === "Date" || selectedFilter === "Filter") {
      return events;
    }
    return events;
  };

  const filteredEvents = filterEvents();

  function eventList() {
    return filteredEvents.map((event) => (
      <TouchableOpacity key={event._id} onPress={() => setSelectedEvent(event)}>
        <EventCard event={event} />
      </TouchableOpacity>
    ));
  }

  const { width } = useWindowDimensions();
  const isMobile = width <= 430;
  const getPadding = () => {
    if (width <= 320) return 4;
    if (width <= 430) return 6;
    return 8;
  };
  const getButtonStyle = () => ({
    paddingVertical: getPadding(),
    paddingHorizontal: getPadding() * 2,
    borderRadius: isMobile ? 12 : 16,
  });
  const getFontSize = () => {
    if (width <= 320) return 12;
    if (width <= 430) return 14;
    return 16;
  };

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isCreateEventFormVisible}
        onRequestClose={() => setIsCreateEventFormVisible(false)}
      >
        <CreateEventForm 
          setIsCreateEventFormVisible={setIsCreateEventFormVisible} 
          onEventCreated={handleEventCreated} 
        />
      </Modal>

      {/* event*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedEvent}
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)}/>}
      </Modal>

      <StatusBar hidden={true} />
      <TopNavBar activeTab="Events" />

      <View style={styles.mainContent}>
        <Sidebar events={joinedEvents} />
        
        {/* Events */}
        <View style={[styles.eventSection, { padding: getPadding() * 2 }]}>
          {/* Filter */}
          <View style={[styles.filterContainer, { marginBottom: getPadding() * 2 }]}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={[styles.filterScrollView, { marginRight: getPadding() }]}
            >
              <View style={[styles.filterButtons, { gap: getPadding() }]}>
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    selectedFilter === "Today" && styles.activeFilter,
                    getButtonStyle(),
                  ]}
                  onPress={() => setSelectedFilter("Today")}
                >
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    selectedFilter === "Tomorrow" && styles.activeFilter,
                    getButtonStyle(),
                  ]}
                  onPress={() => setSelectedFilter("Tomorrow")}
                >
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    selectedFilter === "Date" && styles.activeFilter,
                    getButtonStyle(),
                  ]}
                  onPress={() => setSelectedFilter("Date")}
                >
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Date...</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.filterButton, 
                    selectedFilter === "Filter" && styles.activeFilter,
                    getButtonStyle(),
                  ]}
                  onPress={() => {
                    setSelectedFilter("Filter");
                    setShowTags(true);
                  }}
                >
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Filter</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <TouchableOpacity 
              style={[styles.addEventButton, getButtonStyle()]}
              onPress={() => setIsCreateEventFormVisible(true)}
            >
              <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Add</Text>
            </TouchableOpacity>
          </View>
          {selectedFilter === "Filter" && showTags && (
              <View style={[styles.tagContainer, { gap: getPadding() }]}>
                {TAGS.map((tag) => (
                  <TouchableOpacity 
                    key={tag}
                    style={[
                      styles.tagButton,
                      getButtonStyle(),
                      selectedTag === tag && styles.activeTag,
                    ]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text style={[styles.filterText, { fontSize: getFontSize() }]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
          )}
          {/* event list */}
          <ScrollView>
            {eventList()}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.alabaster,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  eventSection: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterScrollView: {
    flex: 1,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: COLORS.periwinkle,
  },
  activeFilter: {
    backgroundColor: COLORS.indigo,
  },
  addEventButton: {
    backgroundColor: COLORS.brightSun,
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    //alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  tagButton: {
    backgroundColor: COLORS.periwinkle,
    borderRadius: 12,
    marginHorizontal: 1,  
    height: 20,  
    justifyContent: "center",
    alignItems: "center",
  },
  activeTag: {
    backgroundColor: COLORS.indigo,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  eventCategory: {
    color: '#6B7280',
    fontSize: 14,
  },
  eventInfo: {
    alignItems: 'flex-end',
  },
  eventDetails: {
    color: '#374151',
    fontSize: 14,
  },
  eventDescription: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 8,
  },
  eventLimit: {
    textAlign: 'right',
    color: '#6B7280',
    fontSize: 14,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginVertical: 8,
  },
});
