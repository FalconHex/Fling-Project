import React, { useLayoutEffect } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import tw from "tailwind-rn";

const LoginScreen = () => {
    
    const { signInWithGoogle, loading} = useAuth();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (
        <View style={tw("flex-1")}>
            <ImageBackground 
                resizeMode="cover" 
                style={tw("flex-1")}
                source = {{uri : "https://i.imgur.com/UcRP9Yn.png"}}
            >
                
                <TouchableOpacity 
                    style={[
                        tw("absolute bottom-40 w-52 bg-purple-300 p-4 rounded-2xl"), 
                        {marginHorizontal: "25%"}
                    ]}
                    onPress={signInWithGoogle}
                >
                    
                    <Text style={tw("font-bold text-center")}>
                        Sign In & Dive In
                    </Text>
                </TouchableOpacity>

            </ImageBackground>
        </View>
    )
}

export default LoginScreen
