import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase-config';

const auth = getAuth(app);

// Register user
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error registering user:', error.message);
    } else {
      console.error('Unknown error during registration:', error);
    }
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error logging in user:', error.message);
    } else {
      console.error('Unknown error during login:', error);
    }
  }
};
