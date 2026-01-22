import React, {useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/Api';
import { RefreshControl } from 'react-native';
import { getDoctorProfileImage } from '../utils/helpers';

const BookAppointmentScreen = ({ route, navigation }) => {
  const { appointmentId, userId } = route?.params || {};
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [paid, setPaid] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLatestAppointment = async () => {
    try {
      const res = await api.get(`/appointments/user/${userId}`);
      const appointmentList = res.data;
      const matched = appointmentList.find(item => item.id === appointmentId);
      setLatestAppointment(matched);
    } catch (err) {
      console.log('Failed to fetch latest appointment:', err);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await api.put(`/payments/pay/${appointmentId}`);
      alert('Payment successful!');
      setPaid(true); // Mark as paid locally
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  useEffect(() => {
    fetchLatestAppointment();
    const unsubscribe = navigation.addListener('focus', fetchLatestAppointment);
    return unsubscribe;
  }, [appointmentId, userId, navigation]);

  // For now, keep paid static

  if (!latestAppointment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ padding: 20 }}>Loading appointment...</Text>
      </SafeAreaView>
    );
  }

  const appointment = latestAppointment;
  const statusColor = appointment?.status === 'APPROVED' ? 'green' : '#FF6B00';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.circleIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchLatestAppointment} />
        }
        contentContainerStyle={styles.scrollView}>
        {/* Doctor Info */}
        <View style={styles.doctorRow}>
          <Image
            source={getDoctorProfileImage(appointment.doctor.gender)}
            style={styles.avatar}
          />
          <View style={styles.docDetails}>
            <Text style={styles.name}>{appointment.doctor.fullName}</Text>
            <Text style={styles.qualification}>{appointment.doctor.qualification}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badgeBlue}>
                <Text style={styles.badgeText}>{appointment.doctor.specialization}</Text>
              </View>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>₹{appointment.doctor.fees}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bioHeading}>About Doctor</Text>
          <Text style={styles.bioText}>{appointment.doctor.bio}</Text>
        </View>

        {/* Appointment Info */}
        <Text style={styles.sectionTitle}>Appointment Info</Text>
        <View style={styles.infoRow}>
          <View style={styles.columnGroup}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar" size={24} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{appointment.date}</Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="schedule" size={24} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{appointment.time}</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.columnGroup}>
            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark-circle" size={24} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: statusColor }]}>
                {appointment.status}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.iconCircle}>
                <Ionicons name="card" size={24} color="#008080" />
              </View>
              <Text style={styles.infoLabel}>Payment</Text>
              <Text style={[styles.infoValue, { color: paid ? 'green' : '#FF6B00' }]}>
                {paid ? 'Done' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Message Box */}
        <View
          style={[
            styles.paymentBox,
            appointment.status === 'APPROVED'
              ? paid
                ? styles.paymentBoxGreen
                : styles.paymentBoxRed
              : styles.paymentBoxRed,
          ]}
        >
          {appointment.status === 'PENDING' ? (
            <Text style={styles.pendingText}>
              Appointment is pending. Once approved, you'll get the payment option.
            </Text>
          ) : !paid ? (
            <>
              <Text style={styles.pendingText}>
                Your appointment is approved. Continue to pay to proceed.
              </Text>
              <TouchableOpacity style={styles.payMiniBtn} onPress={handlePayment}>
                <Text style={styles.payMiniText}>Proceed to Pay</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.pendingText}>
              Payment done. You'll receive access 30 minutes before your scheduled time.
            </Text>
          )}
        </View>

        {/* Video Call Button */}
        {appointment.status === 'APPROVED' && paid && (
          <TouchableOpacity
            style={styles.videoBtn}
            onPress={() =>
              navigation.navigate('VideoCall', {
                doctor: appointment.doctor,
                patient: {
                  appointmentId: appointment.id,
                  fullName: appointment.user.fullName,
                  gender: appointment.user.gender,
                  // Add anything else you need in VideoCallScreen
                },
              })
            }
          >
            <Ionicons name="videocam" size={20} color="#fff" />
            <Text style={styles.videoText}>Join Video Call</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookAppointmentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:10,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  circleIcon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#e5f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#008080',
    flex: 1,
    textAlign: 'center',
    marginRight: 45, // to balance the back button
    marginTop:10,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  docDetails: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d40',
  },
  qualification: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  badgeBlue: {
    backgroundColor: '#c8e6e6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 80,
  },
  badgeRed: {
    backgroundColor: '#ffede3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 80,
  },
  badgeText: {
    fontSize: 12,
    color: '#004d40',
    fontWeight: '500',
  },
  bioSection: {
    marginBottom: 15,
  },
  bioHeading: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 17,
    color: '#555',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#008080',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  columnGroup: {
    width: '48%',
  },
  infoBox: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    backgroundColor: '#e0f2f1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: -3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#ddd',
  },
  paymentBox: {
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    marginBottom: 20,
  },
  paymentBoxRed: {
    backgroundColor: '#fff5ec',
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B00',
  },
  paymentBoxGreen: {
    backgroundColor: '#e0f8e9',
    borderLeftWidth: 5,
    borderLeftColor: 'green',
  },
  pendingText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  payMiniBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  payMiniText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  videoBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  videoText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

