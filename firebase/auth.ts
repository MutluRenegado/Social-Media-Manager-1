// firebase/auth.ts

import {getAuth} from 'firebase/auth';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {signInWithPopup} from 'firebase/auth';
import {GoogleAuthProvider} from 'firebase/auth';
import {signOut} from 'firebase/auth';
import {onAuthStateChanged} from 'firebase/auth';
import {User} from 'firebase/auth';

import app from './firebase-config';

const auth = getAuth(app);

/** Register user with email and password */
export const registerUser = async (
    email: string,
    password: string
): Promise < User > => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ User registered:', userCredential.user);
        return userCredential.user;
    } catch (error: any) {
        console.error('❌ Registration error:', error.message || error);
        throw error;
    }
};

/** Login user with email and password */
export const loginUser = async (
    email: string,
    password: string
): Promise < User > => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ User logged in:', userCredential.user);
        return userCredential.user;
    } catch (error: any) {
        console.error('❌ Login error:', error.message || error);
        throw error;
    }
};

/** Login with Google */
export const loginWithGoogle = async (): Promise < User > => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log('✅ Google user logged in:', result.user);
        return result.user;
    } catch (error: any) {
        console.error('❌ Google login error:', error.message || error);
        throw error;
    }
};

/** Logout current user */
export const logout = async (): Promise < void > => {
    try {
        await signOut(auth);
        console.log('✅ User logged out');
    } catch (error: any) {
        console.error('❌ Logout error:', error.message || error);
        throw error;
    }
};

/** Listen for auth state changes */
export const listenForAuthChanges = (
    callback: (user: User | null) => void
): (() => void) => {
    return onAuthStateChanged(auth, callback);
};
