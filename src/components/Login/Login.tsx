import React from 'react';
import styles from './Login.module.scss';

interface LoginProps {
  onSignIn: () => void;
}

const Login: React.FC<LoginProps> = ({ onSignIn }) => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Welcome to My To-Do App</h1>
        <p className={styles.loginSubtitle}>Please sign in to continue.</p>
        <button onClick={onSignIn} className={styles.googleSignInButton}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
