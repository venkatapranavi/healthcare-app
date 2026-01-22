// src/screens/DoctorsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/Api';
import { getUserId } from '../utils/storage';
import { getDefaultProfileImage } from './HomeScreen';
import { getDoctorProfileImage } from '../utils/helpers';

const filters = [
  { id: 1, name: 'Neurology' },
  { id: 2, name: 'Cardiology' },
  { id: 3, name: 'Orthopedics' },
  { id: 4, name: 'Geriatrics' },
  { id: 5, name: 'Dermatology' },
  { id: 6, name: 'Pathology' },
  { id: 7, name: 'Ophthalmology' },
  { id: 8, name: 'Pediatrics' },
  { id: 9, name: 'Oncology' },
  { id: 10, name: 'Psychiatry' },
  { id: 11, name: 'Radiology' },
  { id: 12, name: 'Endocrinology' },
  { id: 13, name: 'Anesthesiology' },
  { id: 14, name: 'General surgery' },
];

const DoctorsScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({ fullName: 'User', gender: '' });
  const [selected, setSelected] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchDefaultDoctors();
  }, []);

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

  const fetchDefaultDoctors = async () => {
    try {
      const doctorPromises = [];
      for (let id = 1; id <= 10; id++) {
        doctorPromises.push(api.get(`/doctor/profile/${id}`));
      }
      const responses = await Promise.all(doctorPromises);
      const fetchedDoctors = responses.map((res) => res.data);
      setDoctors(fetchedDoctors);
    } catch (err) {
      console.error('Doctor fetch failed:', err?.response?.data || err.message || err);
    }
  };

  const handleFilterPress = async (specializationName) => {
    try {
      if (selected === specializationName) {
        // Reset to default doctors if same filter is tapped again
        setSelected('');
        fetchDefaultDoctors();
      } else {
        setSelected(specializationName);
        const response = await api.get(`/doctor/search?specialization=${encodeURIComponent(specializationName)}`);
        setDoctors(response.data);
      }
    } catch (err) {
      console.error(`Failed to fetch doctors for ${specializationName}:`, err?.response?.data || err.message || err);
      setDoctors([]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
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
          <View style={styles.circleIcon}>
            <Image source={require('../../assets/icons/bell.jpg')} style={styles.icon} />
          </View>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        style={styles.filterScroll}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => handleFilterPress(f.name)}>
            <View style={[styles.filterCircle, selected === f.name && styles.filterCircleSelected]}>
              <Text style={[styles.filterText, selected === f.name && styles.filterTextSelected]}>{f.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctor List */}
      <ScrollView
        style={{ marginTop: 5 }}
        contentContainerStyle={{ paddingBottom: 60, }}>
        {doctors.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <Image
              source={
                doc.profileImageUrl
                  ? { uri: doc.profileImageUrl }
                  : getDoctorProfileImage(doc.gender)
              }
              style={styles.doctorImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doc.fullName}</Text>
              <Text style={styles.doctorSpec}>{doc.qualification}</Text>
              <Text style={styles.doctorRating}>⭐ {doc.rating ?? '4.5'} (+2000)</Text>
            </View>
            <View style={styles.bookNowBtn}>
              <Text style={styles.doctorFee}>Fees ₹{doc.fees ?? '500'}</Text>
              <TouchableOpacity 
                style={styles.bookBtn}
                onPress={() => navigation.push('DoctorProfileScreen',{ id: doc.id })}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop:10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
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
    backgroundColor: '#fff'
  },
  icon: {
    width: 24,
    height: 24,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterCircle: {
    width: 90,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterCircleSelected: {
    backgroundColor: '#d3d3d3',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  filterTextSelected: {
    color: '#008080',
    fontWeight: '700',
  },
  doctorCard: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
    marginBottom: 16,
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '600',
  },
  doctorSpec: {
    color: '#666',
    fontSize: 14,
  },
  doctorRating: {
    fontSize: 14,
    marginTop: 4,
  },
  doctorFee: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#008080',
    right:10,
  },
  bookNowBtn: {
    alignItems: 'flex-end',
  },
  bookBtn: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    right:10,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
