// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Import auth and db from firebase.ts

interface AuthHookResult {
  user: User | null;
  db: any;
  userId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export const useAuth = (): AuthHookResult => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is called with the imported auth instance
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserId(currentUser?.uid || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider); // Use the imported auth instance
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Use the imported auth instance
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Pass the imported db instance directly, no need for state
  return { user, db, userId, loading, signInWithGoogle, handleSignOut };
};