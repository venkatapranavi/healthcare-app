import React, { useEffect,useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,Alert,
} from 'react-native';
import { Text, TabBar, Tab } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FontAwesome5 } from '@expo/vector-icons';
import api from '../services/Api';
import { getDefaultProfileImage } from './HomeScreen';
import { getDoctorProfileImage } from '../utils/helpers';

const COMMON_TEAL = '#008080';

const AppointmentCard = ({ item }) => {
  if (!item || !item.doctor || !item.user) return null;

  const { doctor, user, date, time, id } = item;

  return (
    <View style={styles.plainCard}>
      <Text style={styles.appointmentId}>Appointment ID: {id}</Text>

      {/* Doctor Section */}
      <View style={styles.profileRow}>
        <Image source={getDoctorProfileImage(doctor.gender)} style={styles.avatar} />
        <View>
          <Text style={styles.nameText}>Doctor: {doctor.fullName}</Text>
          <Text style={styles.roleText}>{doctor.specialization}</Text>
        </View>
      </View>

      {/* User Section */}
      <View style={styles.profileRow}>
        <Image source={getDefaultProfileImage(user.gender)} style={styles.avatar} />
        <View>
          <Text style={styles.nameText}>User: {user.fullName}</Text>
          <Text style={styles.roleText}>Patient</Text>
        </View>
      </View>

      <Text style={styles.details}>
        Scheduled on {new Date(date).toLocaleDateString('en-GB')} at {time?.slice(0, 5)}
      </Text>
    </View>
  );
};

const DoctorApprovalCard = ({ doctor, onApproved }) => {
  const [approved, setApproved] = useState(false);

  const handleApprove = async () => {
    try {
      const res = await api.put(`/admin/approve-doctor/${doctor.id}`);

      // ✅ Show confirmation before hiding
      Alert.alert(
        'Doctor Approved',
        `${doctor.fullName} has been approved successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setApproved(true);
              if (onApproved) onApproved(doctor.id);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor');
    }
  };

  return (
    <View style={styles.doctorApprovalCard}>
      <View style={styles.doctorRow}>
        <Image
          source={getDoctorProfileImage(doctor.gender)}
          style={styles.avatarLarge}
        />
        <View style={styles.docDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.docName}>{doctor.fullName}</Text>
            {!approved ? (
              <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.greenCircle}>
                <Feather name="check" size={18} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.docQual}>{doctor.qualification}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeText}>{doctor.specialization}</Text>
            </View>
            <View style={styles.badgeRed}>
              <Text style={styles.badgeText}>₹{doctor.fees}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.bioText}>{doctor.bio}</Text>
    </View>
  );
};

export const AdminApplicationsScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const res = await api.get('/admin/pending');

        if (Array.isArray(res.data)) {
          setPendingDoctors(res.data);
        } else {
          console.warn('Unexpected doctor data:', res.data);
          setPendingDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching pending doctors:', error);
        setPendingDoctors([]);
      }
    };

    fetchPendingDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/admin/appointments');
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.warn('Unexpected response:', res.data);
          setAppointments([]); // fallback
        }
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setAppointments([]); // fallback on error
      }
    };

    fetchAppointments();
  }, []);

  const [dashboardStats, setDashboardStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        const data = res.data;

        setDashboardStats({
          totalDoctors: data.totalDoctors || 0,
          totalPatients: data.totalPatients || 0,
          totalAppointments: data.totalAppointments || 0,
          totalPayments: data.totalPayments || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  const statsData = {
    totalDoctors: 40,
    pendingDoctors: 0,
    totalPatients: 73,
    totalAppointments: 36,
    totalPayments: 60,
    totalAmountCollected: 0.0,
    dailyAppointments: {
      '2025-06-26': 4,
      '2025-06-27': 7,
      '2025-06-28': 3,
      '2025-06-29': 6,
      '2025-06-30': 5,
      '2025-07-01': 4,
      '2025-07-02': 7,
    },
  };

  const chartLabels = Object.keys(statsData.dailyAppointments).map(date => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  });

  const chartData = Object.values(statsData.dailyAppointments);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        style={styles.tabBar}
        indicatorStyle={{ backgroundColor: COMMON_TEAL }}
      >
        <Tab title={evaProps => <Text {...evaProps} style={[styles.tabTitle, selectedIndex === 0 && styles.activeTab]}>Dashboard</Text>} />
        <Tab title={evaProps => <Text {...evaProps} style={[styles.tabTitle, selectedIndex === 1 && styles.activeTab]}>Appointments</Text>} />
        <Tab title={evaProps => <Text {...evaProps} style={[styles.tabTitle, selectedIndex === 2 && styles.activeTab]}>Doctor Approval</Text>} />
      </TabBar>

      {selectedIndex === 0 && (
        <ScrollView contentContainerStyle={styles.dashboardContainer}>
          <View style={styles.statCircleRow}>
            {[{
              icon: 'stethoscope', label: 'Doctors', value: dashboardStats.totalDoctors },
              { icon: 'user-injured', label: 'Patients', value: dashboardStats.totalPatients },
              { icon: 'calendar-check', label: 'Appointments', value: dashboardStats.totalAppointments },
              { icon: 'money-check-alt', label: 'Payments', value: dashboardStats.totalPayments },
            ].map((item, index) => {
              const fill = Math.min(item.value, 100);
              return (
                <View key={index} style={styles.statCircleContainer}>
                  <AnimatedCircularProgress
                    size={70}
                    width={6}
                    fill={fill}
                    tintColor={COMMON_TEAL}
                    backgroundColor="#e0e0e0"
                    rotation={0}
                    lineCap="round"
                  >
                    {() => (
                      <FontAwesome5 name={item.icon} size={22} color={COMMON_TEAL} />
                    )}
                  </AnimatedCircularProgress>
                  <Text style={styles.statCircleLabel}>{item.label}</Text>
                  <Text style={styles.statCircleValue}>{item.value}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>Weekly Appointments</Text>
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    data: chartData,
                    color: () => '#00b894',
                    strokeWidth: 3,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 32}
              height={260}
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#e5f3f3',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: () => COMMON_TEAL,
                labelColor: () => '#000',
                propsForDots: {
                  r: '5',
                  strokeWidth: '0',
                  stroke: COMMON_TEAL,
                  fill: COMMON_TEAL,
                },
                propsForBackgroundLines: {
                  stroke: '#e0e0e0',
                },
              }}
              bezier
              style={{ borderRadius: 12, padding: 10, }}
            />
          </View>

          <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 }}>  
            <AnimatedCircularProgress
              size={100}
              width={10}
              fill={72} // 36 of 50 = 72%
              tintColor="#008080"
              backgroundColor="#e5f3f3"
              arcSweepAngle={240}
              rotation={240}
              lineCap="round"
              style={{ marginLeft: 16 , marginRight:16}}
            >
              {() => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222' }}>36</Text>
                  <Text style={{ color: '#777', fontSize: 13 }}>of 50</Text>
                </View>
              )}
            </AnimatedCircularProgress>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                Appointments Summary
              </Text>
              <Text style={{ fontSize: 15, color: '#777', marginTop: 4 }}>
                You’ve completed 36 appointments this week.
                Keep up the steady performance.
              </Text>

              <TouchableOpacity style={{ marginTop: 12, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#008080', borderRadius: 30, alignSelf: 'flex-start' }}>
                <Text style={{ fontWeight: '600', color: '#008080' }}>View Insights</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}

      {selectedIndex === 1 && (
        appointments.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>No appointments found.</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AppointmentCard item={item} />}
            contentContainerStyle={styles.listContainer}
          />
        )
      )}

      {selectedIndex === 2 && (
        pendingDoctors.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>No pending doctors found.</Text>
          </View>
        ) : (
          <FlatList
            data={pendingDoctors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DoctorApprovalCard
                doctor={item}
                onApproved={(approvedId) =>
                  setPendingDoctors((prev) => prev.filter((doc) => doc.id !== approvedId))
                }
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
  },
  tabTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  activeTab: {
    color: COMMON_TEAL,
  },
  listContainer: {
    padding: 12,
    backgroundColor: '#fff',
  },
  plainCard: {
    backgroundColor: '#ffffff',
    borderColor: '#008080',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentId: {
    fontSize: 18,
    fontWeight: '700',
    color: COMMON_TEAL,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginTop:-5,
  },
  roleText: {
    fontSize: 12,
    color: '#555',
    marginTop:-5,
  },
  details: {
    textAlign: 'center',
    fontSize: 13,
    color: '#008080',
    marginTop:-5,
  },
  // Doctor Approval Styles
  doctorApprovalCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COMMON_TEAL,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    marginBottom:15,
  },
  docDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008080',
  },
  docQual: {
    fontSize: 12,
    color: '#666',
    marginTop: -5,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 5,
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
    fontSize: 10,
    color: '#004d40',
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14.5,
    color: '#008080',
    lineHeight: 15,
    marginTop: 0,
  },
  approveBtn: {
    backgroundColor: COMMON_TEAL,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  approveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  greenCircle: {
    backgroundColor: '#008080',
    width: 23,
    height: 23,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dashboard styles
circleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
  gap: 12,
},
statCircle: {
  backgroundColor: '#008080',
  width: 70,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 5,
},
statCircleRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingHorizontal: 10,
  marginTop: 20,
},
statCircleContainer: {
  alignItems: 'center',
  gap: 4,
},
statCircleDynamic: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#fff',
  borderColor: '#008080',
  justifyContent: 'center',
  alignItems: 'center',
},
statCircleLabel: {
  fontSize: 13,
  fontWeight: '500',
  color: '#444',
  fontWeight: '700',
  marginTop: 4,
},
statCircleValue: {
  fontSize: 15,
  fontWeight: '600',
  color: '#555',
  marginTop: -8,
},
chartTitle: {
  fontSize: 17,
  color: '#000',
},
chartBox: {
  marginTop: 20,
  paddingHorizontal: 16,
  paddingBottom: 10,
},
});
