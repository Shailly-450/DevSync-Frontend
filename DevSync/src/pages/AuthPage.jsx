import { useNavigate, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../App';
import BackButton from '../components/BackButton';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleAuthSuccess = (userData, token) => {
    login(userData, token);
    navigate('/dashboard');
  };

  // If user is already logged in, redirect them from the auth page
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left side with illustration */}
        <div className={styles.left}>
          <h2>DevSync</h2>
          <p>Collaborate. Organize. Succeed.</p>
          <img src="/vite.svg" alt="DevSync Logo" />
        </div>
        {/* Right side with form */}
        <div className={styles.right}>
          <div className={styles.backBtn + ' ' + styles.backBtnInner}>
            <BackButton to="/" />
          </div>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to continue your journey</p>
          </div>
          <AuthForm onAuthSuccess={handleAuthSuccess} buttonClass={styles.button} />
          <div className={styles.signup}>
            Don't have an account?
            <a href="/signup" className={styles.signupLink}>Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}