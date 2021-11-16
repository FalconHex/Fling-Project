import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import tw from "tailwind-rn";
import useAuth from '../hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { db } from '../firebase';

const ModalScreen = () => {
    
    const { user } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
        });
    
        // console.log(result.uri);
    
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const incompleteForm = !image || !job || !age; 

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.navigate('Home')
        }).catch(error => {
            alert(error.message);
        });
    };
    
    return (
        <View style={tw("flex-1 items-center pt-7 bg-fling")}>
            <Image 
                style={tw("h-20 w-full")}
                resizeMode="contain"
                source={{uri: "https://i.imgur.com/rimotaY.png"}}
            />

            <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>Welcome {user.displayName}</Text>

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 1: The Profile Pic
            </Text>

            <TouchableOpacity 
                value={image}
                onPress={pickImage}
                style={[
                    tw("p-3 rounded-xl mb-5"),
                    image ? tw("bg-green-400") : tw("bg-red-400"),
                ]}
            >
                <Text style={tw("text-center text-white")}>
                    {image ? "Image selected" : "Upload Image"}     
                </Text>
            </TouchableOpacity>
            
            {/* <TextInput 
                style={tw("text-center text-xl pb-2")}
                placeholder="Enter a Profile Pic URL"
                placeholderTextColor="#3c4043"
            /> */}

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 2: About
            </Text>
            <TextInput 
                value={job}
                onChangeText={setJob}
                style={tw("text-center text-xl pb-2")}
                placeholder="Enter your branch"
                placeholderTextColor="#3c4043"
            />

            <Text style={tw("text-center p-4 font-bold text-red-400")}>
                Step 3: The Age
            </Text>
            <TextInput 
                value={age}
                onChangeText={setAge}
                style={tw("text-center text-xl pb-2")}
                placeholder="Enter your age"
                placeholderTextColor="#3c4043"
                keyboardType="numeric"
                maxLength={2}
            />

            <TouchableOpacity 
                disabled={incompleteForm}
                style={[tw("w-64 p-3 rounded-xl absolute bottom-10 bg-red-400"),
                    incompleteForm ? tw('bg-gray-400') : tw("bg-red-400"),
                ]}
                onPress={updateUserProfile}
            >
                <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen
