import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import MessageScreen from '../screens/MessageScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    <View style={styles.customButtonInner}>{children}</View>
  </TouchableOpacity>
);

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: [
            styles.tabBar,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
          ],
          tabBarActiveTintColor: '#0F766E',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Messages"
          component={MessageScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses-outline" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="apps" color={color} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  customButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
