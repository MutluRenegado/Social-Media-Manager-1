import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase-config'; // Assuming firebase-config exports an initialized app instance

const auth = getAuth(app);

// Register user
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
    return userCredential.user; // Return user info if needed
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error registering user:', error.message);
    } else {
      console.error('Unknown error during registration:', error);
    }
    throw error; // Rethrow error for handling in the calling component
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user; // Return user info if needed
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error logging in user:', error.message);
    } else {
      console.error('Unknown error during login:', error);
    }
    throw error; // Rethrow error for handling in the calling component
  }
};
