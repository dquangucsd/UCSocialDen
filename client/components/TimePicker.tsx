import React, { useState, useEffect } from "react";
import { COLORS } from '../utils/constants';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";

const TimePicker = ({ onChange }) => {
  const [hour, setHour] = useState("12");
//   const [isHourDropdownVisible, setIsHourDropdownVisible] = useState(false);
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const handleChange = (type: string, value: string) => {
    if (type === "hour") setHour(value);
    if (type === "minute") setMinute(value);
    if (type === "period") setPeriod(value);
  };

  useEffect(() => {
    let h = +hour;
    if (period === "PM") {
        if (h !== 12) {
            h = h + 12;
        }
    } else if (h === 12) {
        h = 0;
    }
    onChange?.(`${h}:${minute}`);
  }, [hour, minute, period])

  return (
    <View style={styles.container}>
        {/* <View>
            <TouchableOpacity onPress={() => setIsHourDropdownVisible(prev => !prev)}>
                <Text>{hour}</Text>
            </TouchableOpacity>
            {isHourDropdownVisible && (
                <View style={styles.optionsContainer}>
                    {hours.map((h) => (
                        <TouchableOpacity style={styles.options} key={h} onPress={() => handleChange("hour", h)}>{h}</TouchableOpacity>
                    ))}
                </View>
            )}
        </View> */}
        <select value={hour} onChange={(e) => handleChange("hour", e.target.value)} style={styles.select}>
        {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
        ))}
        </select>
        <select value={minute} onChange={(e) => handleChange("minute", e.target.value)} style={styles.select}>
        {minutes.map((m) => (
            <option key={m} value={m}>{m}</option>
        ))}
        </select>
        <select value={period} onChange={(e) => handleChange("period", e.target.value)} style={styles.select}>
        {periods.map((p) => (
            <option key={p} value={p}>{p}</option>
        ))}
        </select>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10
  },
  optionsContainer: {
    backgroundColor: COLORS.blueGray,
    position: "absolute",
    top: 20,
    width: 25,
    padding: 5,
    borderRadius: 10,
  },
  options: {

  },
  select: {
    appearance: "none",
    backgroundColor: "transparent",
    border: "none",
    fontSize: 20,
    fontFamily: "'Zain', sans-serif",
    minWidth: 20
  }
});

export default TimePicker;
