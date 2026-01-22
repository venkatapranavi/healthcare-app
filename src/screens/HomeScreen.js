import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import api from '../services/Api';
import { getUserId } from '../utils/storage';
import { getDoctorById } from '../services/DoctorService';

export const getDefaultProfileImage = (gender) => {
  if (gender?.toLowerCase() === 'female') {
    return require('../../assets/images/femaleuser.jpg');
  }
  return require('../../assets/images/maleuser.jpg');
};

const HomeScreen = ({ navigation }) => {
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
        console.log("Fetched profile:", user);

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

  const categories = [
    
    { id: 14, name: 'Cardiology', icon: require('../../assets/icons/heart.jpg') },
    { id: 3, name: 'Orthopedics', icon: require('../../assets/icons/knee.jpg') },
    { id: 1, name: 'Nephrology', icon: require('../../assets/icons/nephrology.png') },
    { id: 10, name: 'General surgery', icon: require('../../assets/icons/surgery.jpg') },
    { id: 2, name: 'Anesthesiology', icon: require('../../assets/icons/anesthesia.jpg') },
    { id: 4, name: 'Ophthalmology', icon: require('../../assets/icons/eye.jpg') },
    { id: 5, name: 'Pediatrics', icon: require('../../assets/icons/child.jpg') },
    { id: 6, name: 'Oncology', icon: require('../../assets/icons/oncology.jpg') },
    { id: 7, name: 'Dermatology', icon: require('../../assets/icons/skin.jpg') },
    { id: 8, name: 'Pathology', icon: require('../../assets/icons/test-tube.jpg') },
    { id: 9, name: 'Psychiatry', icon: require('../../assets/icons/psych.jpg') },
    { id: 11, name: 'Endocrinology', icon: require('../../assets/icons/endocrine.jpg') },
    { id: 12, name: 'Radiology', icon: require('../../assets/icons/rediology.jpg') },
    { id: 13, name: 'Surgery', icon: require('../../assets/icons/scalpel.jpg') },
    { id: 15, name: 'Geriatrics', icon: require('../../assets/icons/geriatrics.jpg') },
  ]

  const [popularDoctors, setPopularDoctors] = useState([
    { id: 1, data: null, image: require('../../assets/images/docf.jpg') },
    { id: 2, data: null, image: require('../../assets/images/doc1.jpg') },
  ]);

  useEffect(() => {
    const fetchPopularDoctors = async () => {
      try {
        const doctor1 = await getDoctorById(1);
        const doctor2 = await getDoctorById(2);
        setPopularDoctors([
          { id: 1, data: doctor1, image: require('../../assets/images/docf.jpg') },
          { id: 2, data: doctor2, image: require('../../assets/images/doc1.jpg') },
        ]);
      } catch (err) {
        console.error('Failed to fetch popular doctors:', err);
      }
    };

    fetchPopularDoctors();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleIcon} onPress={() => navigation.push('UserProfileScreen')}>
            <Image
              style={styles.iconprofile}
              source={getDefaultProfileImage(userProfile.gender)}
            />
          </TouchableOpacity>
          <View style={styles.headerTextBox}>
            <Text style={styles.label}>Welcome Back</Text>
            <Text style={styles.userName}>{userProfile.fullName}</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.circleIcon}>
              <TouchableOpacity >
                <Image source={require('../../assets/icons/search.jpg')} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.circleIcon}>
              <TouchableOpacity>
                <Image source={require('../../assets/icons/bell.jpg')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Looking for{'\n'}desired doctor?</Text>
            <TouchableOpacity style={styles.searchBtn}>
              <Text style={styles.searchBtnText}>Search for</Text>
            </TouchableOpacity>
          </View>
          <Image source={require('../../assets/images/doc0.jpg')} style={styles.bannerImg} />
        </View>

        {/* Categories */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Find your doctor</Text>
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('OrgansScreen')}>
            <Text style={styles.seeAll}>See All</Text>
            <Text style={styles.arrow}> &gt; </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryBox}>
              <View style={styles.categoryCircle}>
                <Image source={cat.icon} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Popular Doctors */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Popular Doctors</Text>
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('DoctorsScreen')}>
            <Text style={styles.seeAll}>See All</Text>
            <Text style={styles.arrow}> &gt; </Text>
          </TouchableOpacity>
        </View>

        {popularDoctors.map((doc) => (
          doc.data && (
            <View key={doc.id} style={styles.doctorCard}>
              <Image source={doc.image} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doc.data.fullName}</Text>
                <Text style={styles.doctorSpec}>
                  {doc.data.qualification} , {doc.data.specialization}
                </Text>
                <Text style={styles.doctorRating}>⭐ {doc.data.rating} (+1000)</Text>
              </View>
              <View style={styles.bookNowBtn}>
                <Text style={styles.doctorFee}>Fees{"\t\t"} ₹{doc.data.fees}</Text>
                <TouchableOpacity 
                  style={styles.bookBtn}
                  onPress={() => navigation.navigate('DoctorProfileScreen', { id: doc.id })}
                >
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
    backgroundColor: '#fff',
  },
  iconprofile: {
    width: 45,
    height: 45,
  },
  icon: {
    width: 24,
    height: 24,
  },
  banner: {
    backgroundColor: '#008080',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginBottom: 5,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    left:25,
  },
  searchBtn: {
    backgroundColor: '#fff',
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    left:25,
  },
  searchBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bannerImg: {
    width: 140,
    height: 180,
    right:15,
    bottom:-1,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 25,
    marginLeft: 4,
    top:-2,
  },
  categoryScroll: {
    paddingBottom: 0,
  },
  categoryBox: {
    alignItems: 'center',
    marginRight: 14,
  },
  categoryCircle: {
    backgroundColor: '#e5f3f3',
    borderRadius: 40,
    padding: 15,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 55,
    height: 50,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
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
  },
  bookNowBtn: {
    alignItems: 'flex-end',
  },
  bookBtn: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
