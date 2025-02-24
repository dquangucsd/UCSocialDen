import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Modal, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS, MOCK_EVENTS } from '../utils/constants';
import { useCalendar } from '../hooks/useCalendar';
import { useRouter } from 'expo-router';
import TopNavBar from './layout/TopNavBar';
import Sidebar from './layout/Sidebar';
// import CreateEventForm from './CreateEventForm';
import CreateEventForm from './CreateEventForm.tsx';
import EventCard from './EventCard';
import EventDetails from './EventDetails';

const SERVER_PORT = 5002; //process.env.PORT;

export default function HomeScreen() {
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
  // This method fetches the events from the database.
  useEffect(() => {
    async function getEvents() {
      const response = await fetch(`http://localhost:${SERVER_PORT}/api/events`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      console.log("response:", response);
      const events = await response.json();
      setEvents(events);
    }
    getEvents();
    return;
  }, [events.length]);

  function eventList() {
    return events.map((event) => (
      <View key={event._id} style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventCategory}>{event.tags}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventDetails}>Start: {event.start_time}</Text>
            <Text style={styles.eventDetails}>End: {event.end_time}</Text>
            <Text style={styles.eventDetails}>Location: {event.location}</Text>
          </View>
        </View>
        <Text style={styles.eventDescription}>{event.description}</Text>
        {event.image && (
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.eventImage} />
        )}
        <Text style={styles.eventLimit}>{event.cur_joined} / {event.participant_limit}</Text>
      </View>
    ))
  }

  const [isCreateEventFormVisible, setIsCreateEventFormVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { width } = useWindowDimensions();
  const isMobile = width <= 430;

  // Calculate responsive sizes
  const getPadding = () => {
    if (width <= 320) return 4; // Very small phones
    if (width <= 430) return 6; // Regular phones
    return 8; // Tablets and larger
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
      {/* Create event modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateEventFormVisible}
        onRequestClose={() => setIsCreateEventFormVisible(false)}
      >
        <CreateEventForm setIsCreateEventFormVisible={setIsCreateEventFormVisible} />
      </Modal>

      {/* Event details modal (Opens when event card is clicked) */}
      <Modal
        transparent={true}
        visible={!!selectedEvent}
        onRequestClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)}/>}
      </Modal>

      <StatusBar hidden={true} />
      <TopNavBar activeTab="Events" />

      <View style={styles.mainContent}>
        <Sidebar />
        
        {/* Events Section */}
        <View style={[styles.eventSection, { padding: getPadding() * 2 }]}>
          {/* Filters */}
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
                    styles.activeFilter,
                    getButtonStyle(),
                  ]}
                >
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, getButtonStyle()]}>
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, getButtonStyle()]}>
                  <Text style={[styles.filterText, { fontSize: getFontSize() }]}>Date...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButton, getButtonStyle()]}>
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

          {/* Event Cards */}
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
  eventCard: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
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

// export default HomeScreen;
