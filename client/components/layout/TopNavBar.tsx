import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useRouter } from 'expo-router';

interface TopNavBarProps {
  activeTab: string;
}

export default function TopNavBar({ activeTab }: TopNavBarProps) {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const updateMenuPosition = (event: any) => {
    const { pageY, pageX } = event.nativeEvent;
    const windowWidth = Dimensions.get('window').width;
    setMenuPosition({
      top: pageY + 50, // Add some offset from the button
      right: windowWidth - pageX - 20, // Position from the right
    });
  };

  return (
    <>
      <View style={styles.navbar}>
        <Text style={styles.title}>UC Social Den</Text>
        <View style={styles.navLinks}>
          <TouchableOpacity 
            style={styles.navLinkContainer}
            onPress={() => router.push('/')}
          >
            <Text style={[
              styles.navLink,
              activeTab === 'Events' && styles.navLinkActive
            ]}>Events</Text>
            {activeTab === 'Events' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={(event) => {
              updateMenuPosition(event);
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
          >
            <View style={styles.profileCircle} />
          </TouchableOpacity>
        </View>
      </View>

      {isProfileMenuOpen && (
        <>
          <TouchableOpacity 
            style={styles.backdrop}
            onPress={() => setIsProfileMenuOpen(false)}
          />
          <View style={[styles.profileMenu, { top: menuPosition.top, right: menuPosition.right }]}>
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
        </>
      )}
    </>
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
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: "'Zain', sans-serif",
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
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: "'Zain', sans-serif",
  },
  navLinkActive: {
    color: COLORS.brightSun,
  },
  activeIndicator: {
    height: 2,
    backgroundColor: COLORS.brightSun,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
    marginLeft: 12,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brightSun,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  profileMenu: {
    position: 'absolute',
    backgroundColor: COLORS.indigo,
    borderRadius: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
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