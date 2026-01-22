import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/Api';
import { getUserId } from '../utils/storage';
import { useEffect, useState } from 'react';

const options = [
  { icon: require('../../assets/icons/settings.jpg'), label: 'General Settings' },
  { icon: require('../../assets/icons/payment.jpg'), label: 'Payments History' },
  { icon: require('../../assets/icons/faq.jpg'), label: 'Frequently Asked Question' },
  { icon: require('../../assets/icons/love.jpg'), label: 'Favourite Doctors' },
  { icon: require('../../assets/icons/report.jpg'), label: 'Test Reports' },
  { icon: require('../../assets/icons/terms.jpg'), label: 'Terms & Conditions' },
];

export const getDefaultProfileImage = (gender) => {
  if (gender?.toLowerCase() === 'female') {
    return require('../../assets/images/femaleuser.jpg');
  }
  return require('../../assets/images/maleuser.jpg');
};

const MoreScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({
    fullName: 'User',
    gender: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = await getUserId();
        if (!id) return;

        const res = await api.get(`/user/profile/${id}`);
        const user = res.data;

        setUserProfile({
          fullName: user.fullName || 'User',
          gender: user.gender?.trim().toLowerCase() || '',
        });
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.push('UserProfileScreen')}>
            <Image source={getDefaultProfileImage(userProfile.gender)} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.headerTextBox}>
            <Text style={styles.label}>Welcome Back</Text>
            <Text style={styles.userName}>{userProfile.fullName}</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.circleIcon}>
              <Image source={require('../../assets/icons/search.jpg')} style={styles.icon} />
            </View>
            <TouchableOpacity
              style={styles.circleIcon}>
              <Image source={require('../../assets/icons/bell.jpg')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menu}>
          {options.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.menuIcon} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
              {/* Separator line */}
              <View style={styles.separator} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTextBox: {
    marginLeft: 10,
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: -5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 2,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  menu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: '#e5f3f3',
    padding: 10,
    borderRadius: 30,
    marginRight: 15,
  },
  menuIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 50,
  },
});
