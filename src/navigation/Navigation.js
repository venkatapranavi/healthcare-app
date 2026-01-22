import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import OrgansScreen from '../screens/OrgansScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import DoctorProfileScreen from '../screens/DoctorProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import BottomTabNavigator from './BottomTabNavigator';
import MessageScreen from '../screens/MessageScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import { AdminApplicationsScreen } from '../screens/AdminApplicationsScreen';
import DoctorApplicationScreen from '../screens/DoctorApplicationScreen';
import DoctorProfileApplicationScreen from '../screens/DoctorsProfileApplicationScreen';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DoctorRegisterScreen from '../screens/DoctorRegisterScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}/>
        <Stack.Screen 
          name="DoctorRegister" 
          component={DoctorRegisterScreen} 
          options={{ headerShown: false }}/>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OrgansScreen" 
          component={OrgansScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DoctorsScreen" 
          component={DoctorsScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DoctorProfileScreen" 
          component={DoctorProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserProfileScreen" 
          component={UserProfileScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MessageScreen" 
          component={MessageScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="VideoCall" 
          component={VideoCallScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminApplicationsScreen}
          options={{ title: 'Admin View' }}
        />
        <Stack.Screen
          name="Doctor"
          component={DoctorApplicationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DoctorProfile"
          component={DoctorProfileApplicationScreen}
          options={{ headerShown: false }}
        />
        {/* Future screens can be added here */}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
