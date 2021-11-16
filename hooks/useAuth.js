import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as Google from "expo-google-app-auth";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from '@firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({});

const config = {

    androidClientId: "42117056697-g7d4q367f89f2q54ladmqhe30plkgss1.apps.googleusercontent.com" ,
    iosClientId: "42117056697-iqlfn3e3o87090bus8iboboscg5bvpi7.apps.googleusercontent.com",

    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {
    
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => onAuthStateChanged(auth, (user) => {
            if(user){
                // Logged in...
                setUser(user);
            }
            else{
                // Not Logged in...
                setUser(null);
            }

            setLoadingInitial(false);
        }), 
    []);

    const logout = () => {
        setLoading(true);

        signOut(auth)
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }
    
    const signInWithGoogle = async() => {
        setLoading(true);
        
        await Google.logInAsync(config).then(async (logInResult) => {
            if(logInResult.type === 'success'){
                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }

            return Promise.reject();
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    };

    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
    }),
        [user, loading, error]
    );
    
    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}
