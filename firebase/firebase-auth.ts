import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, } from 'firebase/auth';
import app from './firebase-config';
const auth = getAuth(app);
/** Register user with email and password */
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ User registered:', userCredential.user);
        return userCredential.user;
    }
    catch (error) {
        console.error('❌ Registration error:', error.message || error);
        throw error;
    }
};
/** Login user with email and password */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ User logged in:', userCredential.user);
        return userCredential.user;
    }
    catch (error) {
        console.error('❌ Login error:', error.message || error);
        throw error;
    }
};
/** Login with Google */
export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log('✅ Google user logged in:', result.user);
        return result.user;
    }
    catch (error) {
        console.error('❌ Google login error:', error.message || error);
        throw error;
    }
};
/** Logout current user */
export const logout = async () => {
    try {
        await signOut(auth);
        console.log('✅ User logged out');
    }
    catch (error) {
        console.error('❌ Logout error:', error.message || error);
        throw error;
    }
};
/** Listen for auth state changes */
export const listenForAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
