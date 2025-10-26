import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import HomeScreen from './components/HomeScreen';
import ShapeDrawer from './components/ShapeDrawer';
import RunningScreen from './components/RunningScreen';
import CompletionScreen from './components/CompletionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'ShapeRun' }}
        />
        <Stack.Screen 
          name="ShapeDrawer" 
          component={ShapeDrawer} 
          options={{ title: 'Draw Your Shape' }}
        />
        <Stack.Screen 
          name="Running" 
          component={RunningScreen} 
          options={{ title: 'Running', headerShown: false }}
        />
        <Stack.Screen 
          name="Completion" 
          component={CompletionScreen} 
          options={{ title: 'Run Complete!' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
