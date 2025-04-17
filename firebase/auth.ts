import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import app from './firebase-config'; // Ensure this is correctly initialized

const auth = getAuth(app);

// Register user (email/password)
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user (email/password)
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error: unknown) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ Google login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Google user logged in:', result.user);
    return result.user;
  } catch (error: unknown) {
    console.error('Google login error:', error);
    throw error;
  }
};

// ✅ Logout
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error: unknown) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ✅ Auth state listener
export const listenForAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
