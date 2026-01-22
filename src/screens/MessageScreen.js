import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/Api';
import { getUserId } from '../utils/storage';
import { getDefaultProfileImage } from './HomeScreen';

const MessageScreen = () => {
  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState({
    fullName: 'User',
    gender: '',
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await getUserId();
        console.log('📌 User ID:', id);
        if (!id) {
          console.warn('No user ID found');
          return;
        }

        // Fetch profile
        const profileRes = await api.get(`/user/profile/${id}`);
        const user = profileRes.data;

        setUserProfile({
          fullName: user.fullName || 'User',
          gender: user.gender?.trim().toLowerCase() || '',
        });

        // Fetch notifications
        const notifRes = await api.get(`/notifications/USER/${id}`);
        console.log('📩 Notifications response:', notifRes.data);
        const sorted = notifRes.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const mapped = sorted.map((item) => ({
          id: item.id,
          name: 'Notification',
           // Replace with dynamic avatar if needed
          message: item.message || 'No message',
          time: new Date(item.createdAt).toLocaleDateString(), // You can improve format
          seen: item.read || false,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error('❌ Error fetching profile or messages:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.push('UserProfileScreen')}>
          <Image
            source={getDefaultProfileImage(userProfile.gender)}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.headerTextBox}>
          <Text style={styles.label}>Welcome Back</Text>
          <Text style={styles.userName}>{userProfile.fullName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.circleIcon}>
            <Image
              source={require('../../assets/icons/search.jpg')}
              style={styles.icon}
            />
          </View>
          <TouchableOpacity style={styles.circleIcon}>
            <Image
              source={require('../../assets/icons/bell.jpg')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.container}>
        {messages.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
            No messages yet.
          </Text>
        ) : (
          messages.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.messageRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.messageText} numberOfLines={1}>
                    {item.message}
                  </Text>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.time}>{item.time}</Text>
                  {!item.seen ? (
                    <View style={styles.dot} />
                  ) : (
                    <Text style={styles.seenCheck}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              {index < messages.length - 1 && <View style={styles.separator} />}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
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
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#008080', 
    marginBottom: 2,
    fontSize: 17,
    marginLeft:15,
  },
  messageText: {
    color: '#8F9BB3',
    fontSize: 15,
    marginLeft:15,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
  },
  time: {
    fontSize: 14,
    marginBottom: 8,
    color: '#8F9BB3',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C5CEE0',
    alignSelf: 'flex-end',
  },
  seenCheck: {
    color: '#00B383',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 0,
  },
});
