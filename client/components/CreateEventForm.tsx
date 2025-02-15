import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import { Calendar } from 'react-native-calendars';
import { useCalendar } from '../hooks/useCalendar';
import { useMediaQuery } from 'react-responsive';

type CreateEventFormProps = {
    setIsCreateEventFormVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function CreateEventForm(props: CreateEventFormProps) {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1224px)"
    })

    const styles = isDesktop ? stylesDesktop : stylesMobile;

    const {
        currentMonth,
        selectedDate,
        markedDates,
        calendarRef,
        setCurrentMonth,
        setSelectedDate,
        goToToday,
      } = useCalendar([]);

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={styles.titleOccupancyContainer}>
                    <View style={styles.titleContainer}>
                        <TextInput 
                            style={styles.title} 
                            placeholder="Event Name" 
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                    </View>
                    <View style={styles.occupancyContainer}>
                        <TextInput 
                            style={styles.occupancy} 
                            placeholder="000"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                        <Image style={styles.personIcon} source={require("../assets/images/person-icon.png")}/>
                    </View>
                </View>
                <View style={styles.startEndContainer}>
                    <View style={styles.dateContainer}>
                        <TextInput 
                            style={styles.date} 
                            placeholder="00/00 00:00am"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                        <TouchableOpacity >
                            <Image style={styles.calendarIcon} source={require("../assets/images/calendar-icon.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dateContainer}>
                        <TextInput 
                            style={styles.date} 
                            placeholder="00/00 00:00pm"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        />
                        <TouchableOpacity >
                            <Image style={styles.calendarIcon} source={require("../assets/images/calendar-icon.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.locationContainer}>
                    <TextInput 
                        style={styles.location} 
                        placeholder="Somewhere, Someplace"
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    />
                    <TouchableOpacity>
                        <Image style={styles.mapsIcon} source={require("../assets/images/maps-icon.png")} />
                    </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>

                </View>
                <View style={styles.descriptionContainer}>
                    <TextInput 
                        style={styles.description} 
                        placeholder="Description..." 
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        multiline={true}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => props.setIsCreateEventFormVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const stylesMobile = StyleSheet.create({
    // mobile first
    background: {
        backgroundColor: COLORS.alabaster,
        width: "100%",
        height: "100%"
    },
    container: {
        backgroundColor: COLORS.alabaster,
        width: "100%",
        height: "100%",
        padding: 25,
        display: "flex",
        flexDirection: "column",
        gap: 20
    },
    titleOccupancyContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20
    },
    titleContainer: {
        backgroundColor: COLORS.blueGray,
        height: 100,
        borderRadius: 20,
        justifyContent: "center",
        paddingHorizontal: 20,
        flex: 1
    },
    title: {
        fontSize: 48,
        fontFamily: "'Zain', sans-serif"
    },
    occupancyContainer: {
        backgroundColor: COLORS.blueGray,
        height: 100,
        width: 200,
        borderRadius: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    occupancy: {
        fontSize: 48,
        fontFamily: "'Zain', sans-serif",
        width: 100
    },
    startEndContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 20
    },
    dateContainer: {
        backgroundColor: COLORS.blueGray,
        height: 100,
        flex: 1,
        borderRadius: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
    date: {
        fontSize: 36,
        fontFamily: "'Zain', sans-serif",
        width: 200
    },
    calendarIcon: {
        height: 50,
        width: 50
    },
    personIcon: {
        height: 50,
        width: 50
    },
    locationContainer: {
        backgroundColor: COLORS.blueGray,
        height: 100,
        width: 500,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    location: {
        fontSize: 36,
        width: 350,
        fontFamily: "'Zain', sans-serif"
    },
    mapsIcon: {
        height: 50,
        width: 50
    },
    tagsContainer: {
        backgroundColor: COLORS.brightSun,
        height: 50,
    },
    descriptionContainer: {
        backgroundColor: COLORS.blueGray,
        borderRadius: 20,
        flex: 1,
        padding: 20
    },
    description: {
        fontSize: 36,
        fontFamily: "'Zain', sans-serif"
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 20,
        justifyContent: "flex-end"
    },
    cancelButton: {
        backgroundColor: COLORS.indigo,
        height: 100,
        width: 200,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    createButton: {
        backgroundColor: COLORS.indigo,
        height: 100,
        width: 200,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 48,
        fontFamily: "'Zain', sans-serif",
        color: COLORS.alabaster
    }
})

const stylesDesktop = StyleSheet.create({
    background: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        backgroundColor: COLORS.alabaster,
        width: "50%",
        height: "60%",
        padding: 25,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10
    },
    titleOccupancyContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20
    },
    titleContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        borderRadius: 10,
        width: 250,
        justifyContent: "center",
        paddingHorizontal: 10
    },
    title: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif"
    },
    occupancyContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        width: 100,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    occupancy: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        width: 50
    },
    startEndContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    dateContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        width: 200,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    date: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        width: 150
    },
    calendarIcon: {
        height: 25,
        width: 25
    },
    personIcon: {
        height: 25,
        width: 25
    },
    locationContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        width: 300,
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    location: {
        fontSize: 22,
        width: 350,
        fontFamily: "'Zain', sans-serif"
    },
    mapsIcon: {
        height: 25,
        width: 25
    },
    tagsContainer: {
        backgroundColor: COLORS.brightSun,
        height: 25,
    },
    descriptionContainer: {
        backgroundColor: COLORS.blueGray,
        borderRadius: 10,
        flex: 1,
        padding: 10
    },
    description: {
        fontSize: 16,
        fontFamily: "'Zain', sans-serif"
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-end"
    },
    cancelButton: {
        backgroundColor: COLORS.indigo,
        height: 50,
        width: 100,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    createButton: {
        backgroundColor: COLORS.indigo,
        height: 50,
        width: 100,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "'Zain', sans-serif",
        color: COLORS.alabaster
    }
})