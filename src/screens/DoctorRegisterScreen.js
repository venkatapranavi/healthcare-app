import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  FlatList,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { registerDoctor } from '../services/DoctorService';

const COMMON_TEAL = '#008080';

const specializations = [
  'Nephrology', 'Anesthesiology', 'Orthopedics', 'Ophthalmology', 'Pediatrics',
  'Oncology', 'Dermatology', 'Pathology', 'Psychiatry', 'General surgery',
  'Endocrinology', 'Radiology', 'Surgery', 'Cardiology', 'Geriatrics'
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    const startHour = hour;
    const endHour = hour + 1;

    const formatHour = (h) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${hour12}${period}`;
    };

    slots.push(`${formatHour(startHour)} - ${formatHour(endHour)}`);
  }
  return slots;
};

const scheduleTimeRanges = generateTimeSlots();

const DoctorRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialization: '',
    qualification: '',
    gender:'',
    bio: '',
    fees: '',
    rating: '',
    tags: [],
    schedules: [],
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [hidePassword, setHidePassword] = useState(true);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const toggleMultiSelect = (key, value) => {
    const current = formData[key];
    if (current.includes(value)) {
      handleChange(key, current.filter((item) => item !== value));
    } else {
      handleChange(key, [...current, value]);
    }
  };

  const tagsList = [
    'Fever', 'Child Care', 'Leg Pains', 'Headache', 'Diabetes',
    'Skin Allergy', 'Vision Issues', 'Mental Health', 'Thyroid', 'Heart Health',
    'Back Pain', 'Allergy', 'Cold & Cough', 'Arthritis','High Blood Pressure', 'Chest Pain', 'Asthma', 'Depression', 'Anxiety',
    'Hair Loss', 'Ear Pain', 'Sinusitis', 'Constipation', 'Acne',
    'Weight Loss', 'Menstrual Issues', 'Pregnancy Care',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#011E1E" barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/hospital_bg.jpg')}
        style={styles.imageBackground}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="stethoscope" size={25} color={COMMON_TEAL} />
          </View>
          <Text style={styles.title}>Join as a Doctor Today!</Text>
        </View>
      </ImageBackground>

      <View style={styles.registerCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stickyHeader}>
            <Text style={styles.registerTitle}>Doctor Registration</Text>
          </View>

          {[{ key: 'fullName', placeholder: 'Full Name', icon: <Feather name="user" size={20} color={COMMON_TEAL} /> },
            { key: 'email', placeholder: 'Email', icon: <MaterialIcons name="email" size={20} color={COMMON_TEAL} /> },
            { key: 'password', placeholder: 'Password', icon: <MaterialIcons name="lock" size={20} color={COMMON_TEAL} />, secure: true },
            { key: 'qualification', placeholder: 'Qualification', icon: <MaterialIcons name="school" size={20} color={COMMON_TEAL} /> },
            { key: 'gender', placeholder: 'Gender', icon: <MaterialIcons name="person" size={20} color={COMMON_TEAL} /> },
            { key: 'bio', placeholder: 'Short Bio', icon: <MaterialIcons name="info" size={20} color={COMMON_TEAL} /> },
          ].map(({ key, placeholder, icon, secure }) => (
            <View key={key} style={styles.inputContainer}>
              {icon}
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                value={formData[key]}
                onChangeText={(text) => handleChange(key, text)}
                secureTextEntry={secure && hidePassword}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {key === 'password' && (
                <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                  <Feather name={hidePassword ? 'eye-off' : 'eye'} size={18} color="#aaa" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Text style={styles.label}>Specialization</Text>
          <View style={styles.multiPickerWrap}>
            {specializations.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.timeBox, formData.specialization === item && styles.timeBoxSelected]}
                onPress={() => handleChange('specialization', item)}>
                <Text style={{ color: formData.specialization === item ? '#fff' : '#333' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Consultation Fees (₹)</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="attach-money" size={20} color={COMMON_TEAL} />
            <TextInput
              style={styles.input}
              placeholder="0 - 1000"
              keyboardType="numeric"
              value={formData.fees}
              onChangeText={(text) => handleChange('fees', text)}
            />
          </View>

          <Text style={styles.label}>Rating (3.5 - 5.0)</Text>
          <View style={styles.inputContainer}>
            <Entypo name="star" size={20} color={COMMON_TEAL} />
            <TextInput
              style={styles.input}
              placeholder="3.5 - 5.0"
              keyboardType="decimal-pad"
              value={formData.rating}
              onChangeText={(text) => handleChange('rating', text)}
            />
          </View>

          <Text style={styles.label}>Tags</Text>
          <View style={styles.multiPickerWrap}>
            {tagsList.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.timeBox, formData.tags.includes(item) && styles.timeBoxSelected]}
                onPress={() => toggleMultiSelect('tags', item)}>
                <Text style={{ color: formData.tags.includes(item) ? '#fff' : '#333' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Available Schedule</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPickerRow}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayBox, selectedDay === day && styles.dayBoxSelected]}
                onPress={() => setSelectedDay(day)}>
                <Text style={{ color: selectedDay === day ? '#fff' : '#333' }}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.multiPickerWrap}>
            {scheduleTimeRanges.map((slot) => {
              const value = `${selectedDay} ${slot}`;
              const selected = formData.schedules.includes(value);
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.timeBox, selected && styles.timeBoxSelected]}
                  onPress={() => toggleMultiSelect('schedules', value)}>
                  <Text style={{ color: selected ? '#fff' : '#333' }}>{slot}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={async () => {
              try {
                const response = await registerDoctor(formData);

                Alert.alert(
                  'Registered successfully!',
                  'Once your registration is approved by the admin, you will be able to log in and access your appointments.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack(), // or navigation.navigate('Login')
                    },
                  ],
                  { cancelable: false }
                );
              } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. ' + (error?.response?.data?.message || error.message));
              }
            }}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Log In
            </Text>
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DoctorRegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#011E1E' },
  imageBackground: { flex: 1.3, resizeMode: 'cover', justifyContent: 'center' },
  overlay: { flex: 1, paddingLeft: 24, justifyContent: 'center', paddingTop: 85 },
  logoContainer: {
    backgroundColor: '#e5f3f3', width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontSize: 34, color: '#fff', fontWeight: '600' },
  registerCard: {
    flex: 2.7, backgroundColor: '#fff', borderTopLeftRadius: 30,
    borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 8, elevation: 10,
  },
  stickyHeader: { backgroundColor: '#fff', paddingTop: 12, paddingBottom: 8 },
  registerTitle: { fontSize: 25, fontWeight: 'bold', color: '#045D5D' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1,
    borderBottomColor: '#ccc', paddingBottom: 6, marginTop: 18,
  },
  input: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
  label: { fontSize: 15, fontWeight: '500', color: '#444', marginTop: 18, marginBottom: 6 },
  registerButton: {
    backgroundColor: COMMON_TEAL, paddingVertical: 14,
    borderRadius: 10, marginTop: 25, alignItems: 'center',
  },
  registerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { textAlign: 'center', fontSize: 14, marginTop: 20, marginBottom: 50, color: '#444' },
  loginLink: { color: '#045D5D', fontWeight: '600' },
  multiPickerWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, marginBottom: 16 },
  timeBox: {
    borderWidth: 1, borderColor: COMMON_TEAL, borderRadius: 8,
    paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginTop: 8,
  },
  timeBoxSelected: { backgroundColor: COMMON_TEAL, borderColor: COMMON_TEAL },
  dayPickerRow: { marginTop: 8, marginBottom: 12 },
  dayBox: {
    borderWidth: 1, borderColor: COMMON_TEAL, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
  },
  dayBoxSelected: {
    backgroundColor: COMMON_TEAL, borderColor: COMMON_TEAL,
  },
});
