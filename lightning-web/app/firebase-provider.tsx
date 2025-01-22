import React, { createContext, useContext } from 'react';

// import { getAnalytics } from "firebase/analytics";
import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCK5v2MxcIPosUFziOTnBJl9wx4knQjO_g",
  authDomain: "lightning-5853d.firebaseapp.com",
  projectId: "lightning-5853d",
  storageBucket: "lightning-5853d.firebasestorage.app",
  messagingSenderId: "597356620045",
  appId: "1:597356620045:web:ff83798833fdbc5ec6a844",
  measurementId: "G-F8TMB30295"
};

const AppContext = createContext<FirebaseApp | null>(null);

export const FirebaseAppProvider = ({ children }: { children: React.ReactNode }) => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // const analytics = getAnalytics(app);

    return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export const useFirebaseApp = () => {
    const context = useContext(AppContext);
    if (!context) { throw new Error('useApp must be used within an AppProvider'); }
    return context;
}