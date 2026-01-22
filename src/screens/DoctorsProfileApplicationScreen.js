import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDoctorById } from '../services/DoctorService';
import { getDoctorProfileImage } from '../utils/helpers'; // fallback image helper

const DoctorProfileApplicationScreen = ({ navigation, route }) => {
  const doctorId = route?.params?.doctorId; // assume passed via navigation
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorById(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Error loading doctor:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!doctor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ marginTop: 40, textAlign: 'center', color: 'red' }}>Doctor not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.circleIcon} 
          onPress={() => navigation.navigate('Doctor',{
            doctorId: doctor.id,
            name: doctor.fullName,
            gender: doctor.gender,
          })}>
          <Ionicons name="chevron-back" size={22} color="#008080" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Doctor Profile</Text>

        <View style={styles.circleIcon}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#008080" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={getDoctorProfileImage(doctor.gender)} style={styles.avatar} />
            <TouchableOpacity style={styles.editIcon}>
              <Feather name="edit" size={16} color="#008080" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{doctor.fullName}</Text>

          {/* Approved Doctor Badge with Tick */}
          <View style={styles.approvedRow}>
            <View style={styles.tickCircle}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.approvedText}>
              {doctor.status === 'APPROVED' ? 'Approved Doctor' : 'Pending Approval'}
            </Text>
          </View>

          {/* Qualification & Specialization */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="school" size={28} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Qualification</Text>
              <Text style={styles.infoValue}>{doctor.qualification}</Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="medkit" size={28} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Specialization</Text>
              <Text style={styles.infoValue}>{doctor.specialization}</Text>
            </View>
          </View>

          {/* Fees & Rating */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="cash" size={28} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Fees</Text>
              <Text style={styles.infoValue}>₹{doctor.fees}</Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="star" size={28} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{doctor.rating.toFixed(1)}</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.sectionHeading}>About</Text>
          <Text style={styles.aboutText}>{doctor.bio}</Text>

          {/* Tags */}
          <Text style={styles.sectionHeading}>Special Tags</Text>
          <View style={styles.tagsContainer}>
            {doctor.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop:10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#008080',
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5f3f3',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 15,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#e5f3f3',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
  },
  approvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 15,
  },
  tickCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  approvedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008080',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoBox: {
    width: '45%',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#e5f3f3',
    padding: 12,
    borderRadius: 40,
    marginBottom: 6,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: -2,
    textAlign: 'center',
  },
  dividerLine: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  sectionHeading: {
    alignSelf: 'flex-start',
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
    marginLeft:25,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#666',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft:25,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    alignSelf: 'flex-start',
    marginLeft:25,
  },
  tag: {
    backgroundColor: '#e5f3f3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#008080',
    fontWeight: '500',
    fontSize: 13,
  },
});

export default DoctorProfileApplicationScreen;
