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
      participants: string[];
      participant_limit: number;
    };
  }
  
  const EventCard: React.FC<EventProps> = ({ event }) => {

    return (
        
      <View key={event.id} style={styles.eventCard}>
        <View style={styles.eventHeader}>
          {/* Event Title */}
          <View>
            <Text style={styles.eventTitle}>{event.name}</Text>
          </View>

          {/* Event Tag*/}
          <View>
            <TouchableOpacity style={styles.eventTag} disabled>
            <Text style={styles.tagText}>
              {event.tags && event.tags.length > 0 ? event.tags : "Unknown"}
            </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Time Info */}
        <Text style={styles.eventDetails}>
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

        {/* Event Location Info */}
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={14} color="#374151" />
          <Text style={styles.eventDetails}>
             {event.location}
          </Text>
        </View>
        
        {/* <Text style={styles.eventDescription}>{event.description}</Text> */}
        {event.image && (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        )}

        <View style={styles.joinInfo}>
          <Text style={styles.eventLimit}>{event.participants.length} / {event.participant_limit}</Text>
          <TouchableOpacity style={styles.joinButton} >
                  <Text style={styles.joinText}>Join</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

const styles = StyleSheet.create({
    eventSection: {
      flex: 1,
      padding: 15,
    },
    eventCard: {
      backgroundColor: COLORS.blueGray,
      padding: 13,
      paddingBottom: 5,
      marginBottom: 12,
      borderRadius: 8,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: 5,
    },
    eventTitle: {
      fontSize: 23,
      fontFamily: 'Zain',
      fontWeight: 'bold',
      color: COLORS.indigo,
      maxWidth: width * 0.3,
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
        paddingVertical: 5,
        fontFamily: 'Zain',
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      color: COLORS.alabaster,
      fontWeight: 'medium',
      alignSelf: 'center',
    },
    joinText: {
      fontSize: 14,
      color: COLORS.alabaster,
      fontWeight: 'medium',
      alignSelf: 'center',
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    eventDetails: {
      color: '#374151',
      fontFamily: 'Verdana',
      fontSize: 12,
      textAlign: 'left',
      marginBottom: 2,
    },
    eventDescription: {
      color: '#4B5563',
      fontFamily: 'Verdana',
      fontSize: 14,
      marginBottom: 8,
    },
    eventLimit: {
      textAlign: 'left',
      fontSize: 16,
      fontFamily: 'Zain',
      fontWeight: 'bold',
      color: COLORS.indigo,
      marginTop: 10,
    },
    eventImage: {
      width: '100%',
      height: 150,
      borderRadius: 4,
      marginVertical: 8,
    },
  });
    
export default EventCard;
