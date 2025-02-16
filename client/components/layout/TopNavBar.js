import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useRouter } from 'expo-router';

export default function TopNavBar({ activeTab }) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>UC Social Den</Text>
      <View style={styles.navLinks}>
        <TouchableOpacity 
          style={styles.navLinkContainer}
          onPress={() => router.push('/events')}
        >
          <Text style={[
            styles.navLink,
            activeTab === 'Events' && styles.navLinkActive
          ]}>Events</Text>
          {activeTab === 'Events' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.navLinkContainer}
            onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <Text style={styles.navLink}>Profile ▼</Text>
          </TouchableOpacity>

          {isProfileMenuOpen && (
            <View style={styles.profileMenu}>
              <TouchableOpacity 
                style={styles.profileMenuItem}
                onPress={() => {
                  router.push('/profile');
                  setIsProfileMenuOpen(false);
                }}
              >
                <Text style={styles.profileMenuText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.profileMenuItem}
                onPress={() => {
                  console.log('Sign out clicked');
                  setIsProfileMenuOpen(false);
                }}
              >
                <Text style={styles.profileMenuText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.indigo,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLinkContainer: {
    marginHorizontal: 12,
  },
  navLink: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  navLinkActive: {
    color: COLORS.brightSun,
  },
  activeIndicator: {
    height: 2,
    backgroundColor: COLORS.brightSun,
    marginTop: 4,
  },
  profileContainer: {
    position: 'relative',
  },
  profileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: COLORS.indigo,
    borderRadius: 8,
    marginTop: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileMenuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  profileMenuText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
}); 