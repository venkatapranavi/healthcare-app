import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#045D5D" barStyle="light-content" />

      {/* Header */}
      <Text style={styles.header}>Health Care{"\n"}Made Easy</Text>

      {/* Subtitles */}
      <Text style={styles.subtitle}>See a Doctor & Get Prescriptions</Text>
      <Text style={styles.subtext}>Doctors are here to care for your health.</Text>
      <TouchableOpacity
            style={styles.button0}
            onPress={() => navigation.navigate('DoctorRegister')}
            >
            <Text style={styles.buttonText0}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/images/doctor_illustration.jpg')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Log In */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>

      {/* Create Account Button (Continue) */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#045D5D',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 56,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#B0E0E6',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtext: {
    color: '#B0E0E6',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  image: {
    height: 270,
    width: '100%',
    marginBottom: 40,
  },
  loginText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 20,
  },
  button0: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop:-25,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText0: {
    color: '#045D5D',
    fontWeight: 'bold',
    fontSize: 10,
  },
  buttonText: {
    color: '#045D5D',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
