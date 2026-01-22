import React, {useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; // For the tick icon
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDoctorProfileImage } from '../utils/helpers';
import { useRoute } from '@react-navigation/native';
import { getDefaultProfileImage } from '../utils/helpers';
import api from '../services/Api';

const DoctorApplicationScreen = () => {
  const navigation = useNavigation();
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [approvedData, setApprovedData] = useState({});

  const route = useRoute();
  const { doctorId, gender, name, removeUserId } = route.params || {};

  const handleAccept = async (appointmentId) => {
    try {
      const res = await api.put(`/appointments/approve/${appointmentId}`);

      // Update acceptedIds (optional since we now change status directly)
      setAcceptedIds((prev) => [...prev, appointmentId]);

      // Update approvedData (used for display)
      setApprovedData((prev) => ({
        ...prev,
        [appointmentId]: {
          paid: res.data.paid,
          date: res.data.date,
          time: res.data.time,
        },
      }));

      // ✅ Update appointment status & date/time immediately in the local list
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.id === appointmentId
            ? {
                ...appt,
                status: 'APPROVED',
                paid: res.data.paid,
                date: res.data.date,
                time: res.data.time,
              }
            : appt
        )
      );
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(`/appointments/doctor/${doctorId}`);
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching doctor appointments:', error);
      }
    };

    fetchAppointments();

    if (removeUserId) {
      setAppointments(prev => prev.filter(app => app.user.id !== removeUserId));
    }

    const unsubscribe = navigation.addListener('focus', fetchAppointments);
    return unsubscribe;

  }, [doctorId, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>

        <Image source={getDoctorProfileImage(gender)} style={styles.avatar} />

        <View style={styles.headerTextBox}>
          <Text style={styles.label}>Welcome Back</Text>
          <Text style={styles.userName}>{name}</Text>
        </View>

        <View style={styles.headerIcons}>
          <View style={styles.circleIcon}>
            <Image source={require('../../assets/icons/search.jpg')} style={styles.icon} />
          </View>
          <View style={styles.circleIcon}>
            <Image source={require('../../assets/icons/menu.jpg')} style={styles.icon} />
          </View>
        </View>
      </View>

      {/* Section Label */}
      <Text style={styles.sectionTitle}>Appointments</Text>

      {appointments.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
          No appointments found.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {appointments.map((appointment) => {
            const user = appointment.user;
            const isApproved = appointment.status === 'APPROVED';

            return (
              <View key={appointment.id} style={styles.doctorCard}>
                <Image source={getDefaultProfileImage(user.gender)} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{user.fullName}</Text>
                  <Text style={styles.doctorSpec}>
                    Gender: {user.gender} | Age: {user.age}{"\n"}
                    Blood Group: {user.bloodGroup}
                  </Text>
                </View>
                <View style={styles.actionBtns}>
                  {isApproved ? (
                    <View style={styles.acceptedRow}>
                      <AntDesign name="checkcircle" size={18} color="#008080" style={{ marginRight: 4 }} />
                      <Text style={styles.acceptedText}>
                        {appointment.paid ? 'Paid' : 'Unpaid'} | {appointment.date} | {appointment.time}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => handleAccept(appointment.id)}
                    >
                      <Text style={styles.actionBtnText}>Accept</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.videoBtn}
                    onPress={() => navigation.navigate('VideoCall', { doctor:{ fullName: name, gender }, patient: { ...user, appointmentId: appointment.id } })}
                  >
                    <Text style={styles.actionBtnText}>Video Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  icon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#008080',
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
    color: '#555',
    fontSize: 14,
    marginTop: 4,
  },
  actionBtns: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 17,
    marginBottom: 8,
  },
  videoBtn: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  acceptedRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},
acceptedText: {
  color: '#777',
  fontSize: 11,
  fontWeight: '600',
},
});

export default DoctorApplicationScreen;
