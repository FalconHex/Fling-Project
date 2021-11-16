import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from "tailwind-rn"
import Header from '../components/Header';
import ChatList from './../components/ChatList';

const ChatScreen = () => {
    return (
        <SafeAreaView style={tw("flex-1 bg-flingGreen")}>
            <Header title='Chat' />
            <ChatList />
        </SafeAreaView>
    )
}

export default ChatScreen
