import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/Api';
import api from '../services/Api'; // for profile fetch

const COMMON_TEAL = '#008080';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const login = async () => {
    try {
      const response = await loginUser(email, password); // login
      const userId = response.id;
      const role = response.role?.toUpperCase();

      if (!userId) {
        alert('Login failed: No user ID returned.');
        return;
      }

      // 🔁 Fetch full profile
      let profileRes;
      if (role === 'DOCTOR') {
        profileRes = await api.get(`/doctor/profile/${userId}`);
      } else {
        profileRes = await api.get(`/user/profile/${userId}`);
      }
      const profile = profileRes.data;

      // ✅ Store user data
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('userName', profile.fullName || '');
      await AsyncStorage.setItem('userGender', profile.gender || '');

      // ✅ Redirect based on role
      if (role === 'USER') {
        navigation.navigate('MainTabs');
      } else if (role === 'DOCTOR') {
        navigation.navigate('DoctorProfile',{doctorId: userId  });
      } else if (role === 'ADMIN') {
        navigation.navigate('Admin');
      } else {
        alert('Unknown role received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error?.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#011E1E" barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ImageBackground
            source={require('../../assets/images/hospital_bg.jpg')}
            style={styles.imageBackground}
          >
            <View style={styles.overlay}>
              <View style={styles.logoContainer}>
                <FontAwesome5 name="clinic-medical" size={28} color={COMMON_TEAL} />
              </View>
              <Text style={styles.title}>Find a doctor{'\n'}for you now!</Text>
            </View>
          </ImageBackground>

          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Log In</Text>

            <Text style={styles.label}>E-Mail</Text>
            <View style={styles.inputBox}>
              <FontAwesome5 name="user-check" size={18} color={COMMON_TEAL} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="lock-outline" size={20} color={COMMON_TEAL} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="*************"
                placeholderTextColor="#aaa"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Entypo
                  name={hidePassword ? "eye-with-line" : "eye"}
                  size={20}
                  color={COMMON_TEAL}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={login}>
              <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Don’t have an account?{' '}
              <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011E1E',
  },
  imageBackground: {
    flex: 1.4,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: 'center',
    paddingTop:115,
  },
  logoContainer: {
    backgroundColor: '#e5f3f3',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 35,
    color: '#fff',
    fontWeight: '600',
  },
  loginCard: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  loginTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#045D5D',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    color: '#333',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f4f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotText: {
    textAlign: 'right',
    color: '#666',
    fontSize: 15,
    marginTop: 12,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20,
    color: '#444',
  },
  signupLink: {
    color: '#045D5D',
    fontWeight: '600',
  },
});
