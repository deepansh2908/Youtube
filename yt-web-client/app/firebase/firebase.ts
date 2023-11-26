// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth'
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBoFkGc-F5ZYKr-HIjD1cJCqDn2VYc1YJI',
	authDomain: 'fir-213c1.firebaseapp.com',
	projectId: 'fir-213c1',
	appId: '1:870236402989:web:0ace0c5e5ea5f1e98dcfa4',
	measurementId: 'G-39JK7FLPGC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions();

//sign in the user with a popup
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

//signs the user out
export function signOut() {
    return auth.signOut();
}

//trigger a callback when user auth state changes
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

