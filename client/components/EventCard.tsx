import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Modal, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons'; // or 'react-native-vector-icons/MaterialIcons'


const { width, height } = Dimensions.get("window");

interface EventProps {
    event: {
      id: string;
      name: string;
      tags: string;
      start_time: string;
      end_time: string;
      location: string;
      description: string;
      image?: string;
    };
  }
  
  const EventCard: React.FC<EventProps> = ({ event }) => {

    return (
        
      <View key={event.id} style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View>
            <Text style={styles.eventTitle}>{event.name}</Text>
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.eventDetails}>
              <MaterialIcons name="location-on" size={14} color="#374151" /> {event.location}
            </Text>
          </View>
        </View>

        <View style={styles.eventInfo}>
          
        </View>
        <Text style={styles.timeDetails}>
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

        <View>
          <TouchableOpacity style={styles.eventTag} disabled>
          <Text style={styles.eventCategory}>
            {event.tags && event.tags.length > 0 ? event.tags : "Unknown"}
          </Text>
          </TouchableOpacity>
        </View>
        
        {/* <Text style={styles.eventDescription}>{event.description}</Text> */}
        {event.image && (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        )}

        <View style={styles.joinInfo}>
          <Text style={styles.eventLimit}>Cur joined / limit</Text>
          <TouchableOpacity style={styles.joinButton} >
                  <Text style={styles.eventCategory}>Join</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

const styles = StyleSheet.create({
    eventSection: {
      flex: 1,
      padding: 16,
    },
    eventCard: {
      backgroundColor: '#E5E7EB',
      padding: 12,
      marginBottom: 12,
      borderRadius: 8,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    eventTitle: {
      fontSize: 23,
      fontFamily: 'Zain',
      fontWeight: 'bold',
      color: COLORS.indigo,
      maxWidth: width * 0.6,
      lineHeight: 20,
    },
    eventTag: {
        backgroundColor: COLORS.brightSun,
        paddingHorizontal: 5,
        borderRadius: 20,
        maxWidth: width * 0.4,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    joinInfo: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
    },
    joinButton: {
        alignSelf:'flex-end',
        backgroundColor: COLORS.indigo,
        paddingVertical: 6,
        fontFamily: 'Zain',
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    eventCategory: {
      fontSize: 13,
      color: COLORS.alabaster,
      fontWeight: 'medium',
      alignSelf: 'center',
    },
    eventInfo: {
      alignItems: 'flex-end',
      flex: 1,
      justifyContent: 'flex-start',
    },
    eventDetails: {
      color: '#374151',
      fontFamily: 'Verdana',
      fontSize: 12,
      textAlign: 'right',
      maxWidth: width * 0.4,
    },
    timeDetails: {
      color: '#374151',
      fontFamily: 'Verdana',
      fontSize: 12,
      textAlign: 'left',
      marginBottom: 5,
    },
    eventDescription: {
      color: '#4B5563',
      fontFamily: 'Verdana',
      fontSize: 14,
      marginBottom: 8,
    },
    eventLimit: {
      textAlign: 'left',
      fontSize: 20,
      fontFamily: 'Zain',
      fontWeight: 'bold',
      color: COLORS.indigo,
      marginTop: 8,
    },
    eventImage: {
      width: '100%',
      height: 150,
      borderRadius: 4,
      marginVertical: 8,
    },
  });
    
export default EventCard;
