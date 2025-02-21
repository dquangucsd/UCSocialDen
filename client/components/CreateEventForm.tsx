import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../utils/constants';
import { useMediaQuery } from 'react-responsive';
import DateTimePicker from '@react-native-community/datetimepicker';

type ValidInput = {
    isNameValid: boolean,
    isStartDateTimeValid: boolean,
    isEndDateTimeValid: boolean,
    isLocationValid: boolean,
    isParticipantLimitValid: boolean
};

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
    const [name, setName] = useState("");
    const [createTime, setCreateTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    // const [startAmPm, setStartAmPm] = useState("am");
    const [endDate, setEndDate] = useState("")
    const [endTime, setEndTime] = useState("");
    // const [endAmPm, setEndAmPm] = useState("pm");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [eventImage, setEventImage] = useState("");
    const [tags, setTags] = useState([]);
    const [participantLimit, setParticipantLimit] = useState("");

    // form error checking
    const [inputErrors, setInputErrors] = useState<ValidInput>({
        isNameValid: true,
        isStartDateTimeValid: true,
        isEndDateTimeValid: true,
        isLocationValid: true,
        isParticipantLimitValid: true
    });

    const validateFormInput = () => {
        const input:ValidInput = {
            isNameValid: name != "",
            isStartDateTimeValid: startDate.includes("/") && startTime.includes(":"),
            isEndDateTimeValid: endDate.includes("/") && endTime.includes(":"),
            isLocationValid: location != "",
            isParticipantLimitValid: !Number.isNaN(+participantLimit)
        };

        console.log(input);

        setInputErrors(input);
        return (
            input.isNameValid && 
            input.isStartDateTimeValid && 
            input.isEndDateTimeValid && 
            input.isLocationValid && 
            input.isParticipantLimitValid
        );
    }

    const submitCreateEventForm = async () => {
        if (!validateFormInput()) return

        const createTime = new Date(Date.now());
        const startDateTime = new Date(
            createTime.getFullYear(),
            +startDate.split("/")[0]-1,
            +startDate.split("/")[1],
            +startTime.split(":")[0],
            +startTime.split(":")[1]
        );

        const endDateTime = new Date(
            createTime.getFullYear(),
            +endDate.split("/")[0]-1,
            +endDate.split("/")[1],
            +endTime.split(":")[0],
            +endTime.split(":")[1]
        )

        const event = {
            _id: "",
            name: name,
            create_time: createTime,
            start_time: startDateTime,
            end_time: endDateTime,
            location: location,
            description: description,
            participants: [],
            author: "",
            event_image: "",
            tags: tags,
            particapant_limit: participantLimit
        };

        props.setIsCreateEventFormVisible(false);
    }

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                {!inputErrors.isNameValid &&
                    <Text style={styles.errorText}>
                        * Please enter an event name
                    </Text>
                }
                <View style={styles.titleOccupancyContainer}>
                    <View style={styles.titleContainer}>
                        <TextInput 
                            style={styles.title} 
                            placeholder="Event Name" 
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.occupancyContainer}>
                        <TextInput 
                            style={styles.occupancy} 
                            inputMode="numeric"
                            placeholder="000"
                            placeholderTextColor="rgba(0, 0, 0, 0.5)"
                            value={participantLimit}
                            onChangeText={setParticipantLimit}
                        />
                        <Image style={styles.personIcon} source={require("../assets/images/person-icon.png")}/>
                    </View>
                </View>
                {!(inputErrors.isStartDateTimeValid && inputErrors.isEndDateTimeValid) && 
                    <Text style={styles.errorText}>
                        * Please enter date in month/day hr:min
                    </Text>
                }
                <View style={styles.startEndContainer}>
                    <View style={styles.dateContainer}>
                        <View style={styles.dateValueContainer}>
                            <TextInput 
                                style={styles.date} 
                                placeholder="00/00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                            <TextInput
                                style={styles.time}
                                placeholder="00:00"
                                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                                value={startTime}
                                onChangeText={setStartTime}
                            />
                            {/* <TextInput 
                                style={styles.ampm}
                                value={startAmPm}
                                onChangeText={setStartAmPm}
                            /> */}
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
                            {/* <TextInput 
                                style={styles.ampm}
                                value={endAmPm}
                                onChangeText={setEndAmPm}
                            /> */}
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
                {!inputErrors.isLocationValid && 
                    <Text style={styles.errorText}>
                        * Please enter a location
                    </Text>
                }
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
    },
    errorText: {
        fontSize: 16,
        fontFamily: "'Zain', sans-serif",
        color: "red"
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
    },
    errorText: {
        fontSize: 16,
        fontFamily: "'Zain', sans-serif",
        color: "red"
    }
})