import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import useAuth from './hooks/useAuth';
import ModalScreen from './screens/ModalScreen';
import MatchedScreen from './screens/MatchedScreen';
import MessageScreen from './screens/MessageScreen';

// this allows us to navigate through diffrent pages (stacks)

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    
    // var to check if user is logged in or not
    const { user } = useAuth();

    return (
        // stack.navigator is the parent div containtng all the pages to be made available in app
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            {/* if user is logged in => show app */}
            {user ? (
                <>
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} />
                        <Stack.Screen name="Message" component={MessageScreen} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ presentation: 'modal'}}>
                        <Stack.Screen name="Modal" component={ModalScreen} />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ presentation: 'transparentModal'}}>
                        <Stack.Screen name="Matched" component={MatchedScreen} />
                    </Stack.Group>
                    
                </>
            ) : ( //else show login page
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    )
}

export default StackNavigator
