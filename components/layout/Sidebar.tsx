import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../../utils/constants';
import { useCalendar } from '../../hooks/useCalendar';

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

  return (
    <View style={[
      styles.sidebar,
      isMobile && styles.sidebarMobile
    ]}>
      {isMobile && (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setIsOpen(false)}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sidebarTitle}>Your Events</Text>
      {['Name', 'Name', 'Name', 'Name', 'Name', 'Name'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{item}</Text>
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
  );
}

const styles = StyleSheet.create({
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
    top: '50%',
    backgroundColor: COLORS.indigo,
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: '#000000',
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