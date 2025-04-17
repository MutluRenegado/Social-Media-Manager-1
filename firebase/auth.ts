import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import app from './firebase-config';

const auth = getAuth(app);

// Register user (email/password)
export const registerUser = async (email: string, password: string): Promise<User | void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user (email/password)
export const loginUser = async (email: string, password: string): Promise<User | void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ Google login
export const loginWithGoogle = async (): Promise<User | void> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google user logged in:', result.user);
    return result.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// ✅ Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ✅ Auth state listener
export const listenForAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
