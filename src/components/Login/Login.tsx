import React from 'react';
import styles from './Login.module.scss';

interface LoginProps {
  onSignIn: () => void;
  loading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onSignIn, loading, error }) => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Welcome to My To-Do App</h1>
        <p className={styles.loginSubtitle}>Please sign in to continue.</p>
        <button onClick={onSignIn} className={styles.googleSignInButton} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;