import { useState, useEffect } from 'react';
import { loginWithGoogle, logout, listenForAuthChanges } from '../../firebase/auth';
import { User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = listenForAuthChanges(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const loggedInUser = await loginWithGoogle();
      console.log('Logged in with Google:', loggedInUser);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
}
