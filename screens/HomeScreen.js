import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Button, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native'
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn"
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from '@firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
    {
        firstName: "Joyal",
        lastName: "Palackel",
        job: "Btech Student",
        photoURL: "https://scontent.fdel8-1.fna.fbcdn.net/v/t1.6435-9/76650754_1495663657253232_7472055150035599360_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=7IgihGhO-tUAX8_Zjfc&_nc_oc=AQn1utpQwkZXhCrhW9thuHpm_wttOBRYuAWWM_In454I-QVYAoZoQhVu8n7JA1Nt-RU&_nc_ht=scontent.fdel8-1.fna&oh=a827deb0a7bca504f55c09e8e1c45aca&oe=61B5B642",
        age: 20,
        id: 123,
    },
    {
        firstName: "Bharat",
        lastName: "Kharbanda",
        job: "Student",
        photoURL: "https://scontent.fdel8-1.fna.fbcdn.net/v/t1.6435-9/142314430_3376199149157144_5637942981340558579_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=rvMZbOuwqwcAX_iM3Es&_nc_ht=scontent.fdel8-1.fna&oh=e9fac738fd6117a38f9627fe4b8e47fd&oe=61B819F4",
        age: 21,
        id: 456,
    },
    {
        firstName: "Meme",
        lastName: "Face",
        job: "Comedy",
        photoURL: "https://i.imgur.com/cLPYBzn.jpg",
        age: 99,
        id: 789,
    },
];


const HomeScreen = () => {
    
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);

    useLayoutEffect(
        () => 
            onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
            if(!snapshot.exists()){
                navigation.navigate("Modal");
            }
        }),
    []);

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );
            
            const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then(
                (snapshot) => snapshot.docs.map((doc) => doc.id)
            );

            

            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

            unsub = onSnapshot(
                query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), 
                snapshot => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            });
        };

        fetchCards();
        return unsub;
    },[db]);

    const swipeLeft = (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id),userSwiped);
    };

    const swipeRight = async(cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];

        const loggedInProfile = await (
            await getDoc(doc(db, 'users', user.uid))
        ).data();

        // check if user swiped on you 
        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
            (documentSnapshot) => {
                if(documentSnapshot.exists()){
                    // user had already swiped you
                    
                    console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

                    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id),userSwiped);

                    // create a match
                    setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp(),
                    });

                    navigation.navigate('Matched', {
                        loggedInProfile, 
                        userSwiped,
                    });

                }
                else{
                    // you swiped them first
                    console.log(`You swiped on ${userSwiped.displayName}`);
                }
            }
        );

        console.log(`You swiped MATCH on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id),userSwiped);
    }
    

    return (
        <SafeAreaView style={tw("flex-1 bg-fling")}>
            {/* Header */}
            <View style={tw("flex-row items-center justify-between px-5 top-2")}>
                <TouchableOpacity onPress={logout}>
                    <Image style={tw('h-10 w-10 rounded-full')} source={{uri: user.photoURL }}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                    <Image style={tw('h-14 w-14')} source={require("../Fling.png")} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Chat')}> 
                    <Ionicons name='chatbubbles-sharp' size={30} color="#ba0605" />
                </TouchableOpacity>
            </View>

            
            {/* End of Header */}

            {/* Cards */}
            <View style={tw("flex-1 -mt-3")}>
                <Swiper 
                    ref = {swipeRef}
                    containerStyle={{ backgroundColor: "transparent"}}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log('Swipe PASS');
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log('Swipe MATCH')
                        swipeRight(cardIndex);
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red"
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4DED30"
                                },
                            },
                        },

                    }}
                    renderCard = {(card) => card ? (
                        <View key={card.id} style={tw("relative bg-white h-3/4 rounded-xl")}>
                            <Image 
                                style={tw("absolute top-0 h-full w-full rounded-xl")} 
                                source={{uri: card.photoURL}}
                            />

                            <View style={[tw("absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl"), styles.cardShadow]}>
                                <View>
                                    <Text style={tw("text-xl font-bold")}>
                                        {card.displayName}
                                    </Text>
                                    <Text>
                                        {card.job}
                                    </Text>
                                </View>
                                <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                            </View>
                        </View>  
                    ): (
                        <View style={[tw("relative bg-white h-3/4 rounded-xl justify-center items-center"),styles.cardShadow]}>
                            
                            <Text style={tw("pb-5 font-bold")}>
                                        No more profiles
                            </Text>

                            <Image 
                                style={tw("top-0 h-60 w-full")}
                                height={100}
                                width={100} 
                                source={{uri: "https://i.imgur.com/H6oEzeB.gif"}}
                            />
                        </View> 
                    )}
                        
                />
            </View>
            
            {/* Cards end */}

            <View style={tw("flex flex-row justify-evenly bottom-7")}>
                <TouchableOpacity 
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tw("items-center justify-center rounded-full w-16 h-16 bg-red-200")}
                >
                    <Entypo name='cross' size={24} color='red' />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()} 
                    style={tw("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
                >
                    <AntDesign name='heart' size={24} color='green'/>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});
