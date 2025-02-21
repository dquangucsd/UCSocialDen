import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../utils/constants';
import { useMediaQuery } from 'react-responsive';
import DateTimePicker from '@react-native-community/datetimepicker';

type CreateEventFormProps = {
    setIsCreateEventFormVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export default function CreateEventForm(props: CreateEventFormProps) {
    const isDesktop = useMediaQuery({
        query: "(min-width: 1224px)"
    })

    const styles = isDesktop ? stylesDesktop : stylesMobile;

    const today = new Date(Date.now());
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

    // save form values
    const [title, setTitle] = useState("");
    const [occupancy, setOccupancy] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [startAmPm, setStartAmPm] = useState("am");
    const [endDate, setEndDate] = useState("")
    const [endTime, setEndTime] = useState("");
    const [endAmPm, setEndAmPm] = useState("pm");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const submitCreateEventForm = async () => {
        const event = {
            id: "",
            title: title,
            category: "",
            start: startTime,
            end: endTime,
            location: location,
            description: description
        };

        props.setIsCreateEventFormVisible(false);
    }

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <View style={styles.titleOccupancyContainer}>
                    <View style={styles.titleContainer}>
                        <TextInput 
                            style={styles.title} 
                            placeholder="Event Name" 
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    <View style={styles.occupancyContainer}>
                        <TextInput 
                            style={styles.occupancy} 
                            inputMode="numeric"
                            placeholder="000"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={occupancy}
                            onChangeText={setOccupancy}
                        />
                        <Image style={styles.personIcon} source={require("../assets/images/person-icon.png")}/>
                    </View>
                </View>
                <View style={styles.startEndContainer}>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateValueContainer}>
                            <TextInput 
                                style={styles.date} 
                                placeholder="00/00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={startTime}
                                onChangeText={setStartTime}
                            />
                            <TextInput
                                style={styles.time}
                                placeholder="00:00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                            <TextInput 
                                style={styles.ampm}
                                value={startAmPm}
                                onChangeText={setStartAmPm}
                            />
                        </View>
                        <TouchableOpacity onPress={() => setIsDateTimePickerVisible(true)}>
                            <Image style={styles.calendarIcon} source={require("../assets/images/calendar-icon.png")} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dateContainer}>
                    <View style={styles.dateValueContainer}>
                            <TextInput 
                                style={styles.date} 
                                placeholder="00/00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={endDate}
                                onChangeText={setEndDate}
                            />
                            <TextInput
                                style={styles.time}
                                placeholder="00:00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={endTime}
                                onChangeText={setEndTime}
                            />
                            <TextInput 
                                style={styles.ampm}
                                value={endAmPm}
                                onChangeText={setEndAmPm}
                            />
                        </View>
                        <TouchableOpacity >
                            <Image style={styles.calendarIcon} source={require("../assets/images/calendar-icon.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {(isDateTimePickerVisible && (Platform.OS != "web")) && <DateTimePicker
                    value={today}
                    mode="datetime"
                />}
                <View style={styles.locationContainer}>
                    <TextInput 
                        style={styles.location} 
                        placeholder="Somewhere, Someplace"
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                        value={location}
                        onChangeText={setLocation}
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
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => props.setIsCreateEventFormVisible(false)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createButton} onPress={() => submitCreateEventForm()}>
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
        gap: 10
    },
    titleOccupancyContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10
    },
    titleContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        paddingHorizontal: 10,
        flex: 1
    },
    title: {
        fontSize: 24,
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
        fontSize: 24,
        fontFamily: "'Zain', sans-serif",
        width: 50
    },
    personIcon: {
        height: 25,
        width: 25
    },
    startEndContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    dateContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        flex: 1,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    dateValueContainer: {

    },
    time: {

    },      
    ampm: {

    },
    date: {
        fontSize: 18,
        fontFamily: "'Zain', sans-serif",
        width: 125
    },
    calendarIcon: {
        height: 25,
        width: 25
    },
    locationContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        width: 250,
        borderRadius: 10,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    location: {
        fontSize: 18,
        width: 200,
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
        fontSize: 18,
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
        fontSize: 24,
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
    personIcon: {
        height: 25,
        width: 25
    },
    startEndContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10
    },
    dateContainer: {
        backgroundColor: COLORS.blueGray,
        height: 50,
        width: 225,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10
    },
    dateValueContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    date: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        width: 60,
    },
    time: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        width: 50,
    },
    ampm: {
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        width: 50,
    },
    calendarIcon: {
        height: 25,
        width: 25,
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
        fontSize: 22,
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
        fontSize: 22,
        fontFamily: "'Zain', sans-serif",
        color: COLORS.alabaster
    }
})