
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyAjal2Iydd3QeedN7mzqXbFqoOtLhAwmVc",
    authDomain: "proyectointegrado-abdc9.firebaseapp.com",
    projectId: "proyectointegrado-abdc9",
    storageBucket: "proyectointegrado-abdc9.firebasestorage.app",
    messagingSenderId: "355101256678",
    appId: "1:355101256678:web:18dbba67007333f8e80427"
};

const app = getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);
