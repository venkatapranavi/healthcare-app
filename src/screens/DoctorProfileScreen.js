import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { getDoctorProfileImage } from '../utils/helpers';
import api from '../services/Api';
import { getUserId } from '../utils/storage';

const DoctorProfileScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('15');
  const [selectedTime, setSelectedTime] = useState('09-10 AM');
  const [selectedPeriod, setSelectedPeriod] = useState('Afternoon');
  const [selectedTag, setSelectedTag] = useState(null);
  const [previousTag, setPreviousTag] = useState(null);
  const [monthYearModalVisible, setMonthYearModalVisible] = useState(false);
  const [monthIndex, setMonthIndex] = useState(new IndexPath(9));
  const [yearIndex, setYearIndex] = useState(new IndexPath(0));

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025', '2026'];
  const dates = ['1','2','3','4','5','6','7','8','9','10',
    '11','12','13','14','15', '16', '17', '18', '19', '20',
    '21','22','23','24','25','26','27','28','29','30'];
  const morningTimes = ['09-10 AM', '10-11 AM', '11-12 AM'];
  const afternoonTimes = ['01-02 PM', '02-03 PM', '03-04 PM'];
  const eveningTimes = ['04-05 PM', '05-06 PM', '06-07 PM'];
  const periods = ['Morning', 'Afternoon', 'Evening'];

  const tags = doctor
    ? [
        doctor.specialization,
        `${doctor.specialization} medicine`,
        'Medicine',
      ]
    : [];

    const handleBooking = async () => {
      try {
        const userId = await getUserId();
        const year = years[yearIndex.row];
        const month = String(monthIndex.row + 1).padStart(2, '0');
        const day = String(selectedDate).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        
        const getStartTime = (slot) => {
          const [start] = slot.split('-');
          const [hour, suffix] = start.trim().split(/(AM|PM)/);
          let [h, m] = hour.split(':');
          h = parseInt(h);
          if (suffix === 'PM' && h !== 12) h += 12;
          if (suffix === 'AM' && h === 12) h = 0;
          return `${String(h).padStart(2, '0')}:00:00`;
        };

        const time = getStartTime(selectedTime);

        const response = await api.post(`/appointments/book`, null, {
          params: {
            userId,
            doctorId: doctor.id,
            date,
            time,
          },
        });

        alert('Appointment booked successfully!');

        // 🔁 PASS userId + appointmentId
        navigation.navigate('BookAppointment', {
          appointmentId: response.data.id,
          userId: userId,
        });

      } catch (error) {
        console.error('Booking failed:', error);
        alert('Failed to book appointment.');
      }
    };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctor/profile/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Failed to fetch doctor data:', err);
      }
    };

    fetchDoctor();
  }, [id]);

  const getDayName = (date, month, year) => {
    const d = new Date(`${year}-${month + 1}-${date}`);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getTimesForPeriod = () => {
    if (selectedPeriod === 'Morning') return morningTimes;
    if (selectedPeriod === 'Afternoon') return afternoonTimes;
    return eveningTimes;
  };

  const getTagStyle = (tag) => {
    if (tag === selectedTag) return [styles.tag, styles.selectedTag];
    if (tag === previousTag) return [styles.tag, styles.previousTag];
    return [styles.tag, styles.defaultTag];
  };

  const getTagTextStyle = (tag) => {
    if (tag === selectedTag) return styles.selectedTagText;
    return styles.normalTagText;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Profile</Text>
        </View>

        {doctor && (
          <View style={styles.doctorCardCenter}>
            <Image source={getDoctorProfileImage(doctor.gender)} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.fullName}</Text>
              <Text style={styles.doctorSpec}>{doctor.qualification}</Text>
              <Text style={styles.doctorRating}>⭐ {doctor.rating?.toFixed(1)} (+2000)</Text>
            </View>
          </View>
        )}

        <View style={styles.tagsBelowImage}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={getTagStyle(tag)}
              onPress={() => {
                if (tag !== selectedTag) {
                  setPreviousTag(selectedTag);
                  setSelectedTag(tag);
                }
              }}
            >
              <Text style={getTagTextStyle(tag)}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor Biography</Text>
          <Text style={styles.bio}>{doctor?.bio}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Schedules</Text>
            <TouchableOpacity
              style={styles.monthYearBtn}
              onPress={() => setMonthYearModalVisible(true)}
            >
              <View style={styles.monthYearRow}>
                <Text style={styles.monthYearText}>
                  {months[monthIndex?.row ?? 0]} {years[yearIndex?.row ?? 0]}
                </Text>
                <Image source={require('../../assets/icons/vimage.jpg')} style={styles.vImage} />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((date, index) => (
              <View key={index} style={styles.dateWrapper}>
                <TouchableOpacity
                  style={[styles.dateBox, selectedDate === date && styles.selectedBtn]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dateText, selectedDate === date && styles.selectedText]}>
                    {date}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.dayBelowDate}>
                  {getDayName(date, monthIndex?.row ?? 0, parseInt(years[yearIndex?.row ?? 0]))}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.periodHeading}>Choose Times</Text>
        <View style={styles.periods}>
          {periods.map((period, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.periodBtn, selectedPeriod === period && styles.selectedPeriodBtn]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodText, selectedPeriod === period && styles.selectedText]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scheduleBox}>
          <Text style={styles.scheduleLabel}>{selectedPeriod} Schedule</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRow}>
            {getTimesForPeriod().map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeBox, selectedTime === time && styles.selectedTimeBtn]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && { color: '#fff' }]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={handleBooking}
          >
          <Text style={styles.bookText}>Book Appointment ({doctor?.fees})</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={monthYearModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setMonthYearModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Month & Year</Text>

          <View style={styles.modalDropdownContainer}>
            <Select
              selectedIndex={monthIndex}
              value={months[monthIndex?.row ?? 0]}
              onSelect={(index) => setMonthIndex(index)}
              style={styles.modalSelectBox}
            >
              {months.map((month, i) => (
                <SelectItem key={i} title={month} />
              ))}
            </Select>

            <Select
              selectedIndex={yearIndex}
              value={years[yearIndex?.row ?? 0]}
              onSelect={(index) => setYearIndex(index)}
              style={styles.modalSelectBox}
            >
              {years.map((year, i) => (
                <SelectItem key={i} title={year} />
              ))}
            </Select>
          </View>

          <TouchableOpacity
            style={styles.modalDoneBtn}
            onPress={() => setMonthYearModalVisible(false)}
          >
            <Text style={styles.modalDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DoctorProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 30,
    color: '#000',
    bottom: 7,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
    color: '#000',
  },
  doctorCardCenter: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
  },
  doctorSpec: {
    fontSize: 16,
    color: '#666',
  },
  doctorRating: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  tagsBelowImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 10,
  },
  tag: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 3,
    marginBottom: 8,
  },
  defaultTag: {
    backgroundColor: '#f0f0f0',
  },
  selectedTag: {
    backgroundColor: '#cfd8dc',
  },
  previousTag: {
    backgroundColor: '#efe6e6',
  },
  normalTagText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedTagText: {
    color: '#008080',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 3,
  },
  bio: {
    fontSize: 16,
    color: '#555',
  },
  dateWrapper: {
    alignItems: 'center',
    marginRight: 10,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#e5f3f3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: 55,
    backgroundColor: '#e5f3f3',
    alignItems: 'center',
  },
  selectedBtn: {
    backgroundColor: '#008080',
    borderColor: '#008080',
  },
  dateText: {
    fontSize: 20,
    color: '#008080',
  },
  selectedText: {
    color: '#fff',
  },
  dayBelowDate: {
    fontSize: 16,
    color: '#666',
  },
  periodHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  periods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  periodBtn: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e5f3f3',
    alignItems: 'center',
  },
  selectedPeriodBtn: {
    backgroundColor: '#008080',
  },
  periodText: {
    fontSize: 14,
    color: '#008080',
    fontWeight: '600',
  },
  scheduleBox: {
    backgroundColor: '#e5f3f3',
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008080',
    marginBottom: 10,
    marginLeft: 3,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 5,
  },
  timeBox: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeBtn: {
    backgroundColor: '#008080',
    borderColor: '#008080',
  },
  timeText: {
    fontSize: 15,
  },
  bookBtn: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 320,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  modalDropdownContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  modalSelectBox: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#008080',
  },
  modalDoneBtn: {
    backgroundColor: '#008080',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalDoneText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthYearBtn: {
    padding: 4,
  },
  monthYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthYearText: {
    fontSize: 14,
    fontWeight: '600',
  },
  vImage: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
});
