import React from 'react';
import StackNavigator from './StackNavigator';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './hooks/useAuth';


export default function App() {


  return (
    <NavigationContainer>
      {/* HOC: Higher Order Component used to wrap everything under Auth */}
      <AuthProvider>
        {/* passes down all the auth stuff to children */}
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
    
  );
}



