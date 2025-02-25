import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS } from '../utils/constants';
import { useRouter } from 'expo-router';

export default function WelcomePage() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width <= 430;

    // Email signature to append
    const emailSignature = '@ucsd.edu';

    // Login/Signup state
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    const handleChange = (value: string) => {
        // Limit user input to the part before '@example.com'
        const updatedEmail = value.split('@')[0]; // Prevent input after the '@' symbol
        setFormData({ ...formData, email: updatedEmail });
    };

    const handleSubmit = (type: 'login' | 'signup') => {
        console.log(`${type} with`, formData);
        router.push('/HomeScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Text style={styles.title}>UC Social Den</Text>
            </View>


            {/* Tab buttons for Login / Sign Up */}
            <View style={styles.auth}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'login' && styles.activeTab]}
                    onPress={() => setActiveTab('login')}
                >
                    <Text style={styles.tabText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'signup' && styles.activeTab]}
                    onPress={() => setActiveTab('signup')}
                >
                    <Text style={styles.tabText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            {/* Form for Login / Sign Up */}
            <View style={styles.formContainer}>
                <View style={styles.emailContainer}>
                    <TextInput
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={handleChange}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <Text style={styles.emailSignature}>{emailSignature}</Text>
                </View>

                <TextInput
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    style={styles.input}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit(activeTab)}
                >
                    <Text style={styles.submitButtonText}>{activeTab === 'login' ? 'Login' : 'Sign Up'}</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.alabaster,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.indigo,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
        fontFamily: 'Zain',
    },
    auth: {},
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        width: '100%',
        justifyContent: 'space-around',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.indigo,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 16,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '100%',
    },
    emailSignature: {
        marginLeft: 8,
        fontSize: 16,
        color: '#ccc',
        paddingVertical: 12,
    },
    submitButton: {
        backgroundColor: COLORS.indigo,
        paddingVertical: 12,
        width: '100%',
        borderRadius: 8,
        alignItems: 'center',
        marginTop:10,
    },
    submitButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
