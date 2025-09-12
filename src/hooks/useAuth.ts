// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, AuthError } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import auth and db from firebase.ts

interface AuthHookResult {
  user: User | null;
  db: any;
  userId: string | null;
  loading: boolean;
  error: string | null; // Added a state variable for errors
  signInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export const useAuth = (): AuthHookResult => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to store error messages

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserId(currentUser?.uid || null);
      setLoading(false);
      setError(null); // Clear any previous errors on auth state change
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null); // Clear any previous errors before a new attempt
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (error instanceof Error) {
        // Set a user-friendly error message based on the error type
        setError("Failed to sign in. Please try again or check your network connection.");
        if ('code' in error && (error as AuthError).code === 'auth/popup-closed-by-user') {
          setError("Sign-in process was canceled. Please try again.");
        }
      } else {
        setError("An unknown error occurred during sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await signOut(auth);
    }
    catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  return { user, db, userId, loading, error, signInWithGoogle, handleSignOut };
};