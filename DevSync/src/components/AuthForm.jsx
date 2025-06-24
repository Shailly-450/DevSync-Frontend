import { useState } from "react";
import { login, register } from "../utils/api";
import { BACKEND_URL } from "../utils/env";
import styles from '../pages/AuthPage.module.css';

export default function AuthForm({ onAuthSuccess, buttonClass }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (isLogin) {
        response = await login({ email, password });
      } else {
        response = await register({ name, email, password });
      }
      if (onAuthSuccess && response.data) {
        onAuthSuccess(response.data.user, response.data.token);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://devsync-backend-7jal.onrender.com/api/auth/google';
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24, width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>{isLogin ? "Login" : "Register"}</h2>
      {error && <p style={{ color: '#dc2626', marginBottom: 8 }}>{error}</p>}
      {!isLogin && (
        <input
          style={{ width: '100%', marginBottom: 12, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 16 }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        style={{ width: '100%', marginBottom: 12, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 16 }}
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={{ width: '100%', marginBottom: 12, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 16 }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className={buttonClass || styles.button}
        style={{ width: '100%' }}
        disabled={loading}
      >
        {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
      </button>
      <button
        type="button"
        className={styles.button}
        style={{ width: '100%', background: 'linear-gradient(90deg,#ef4444 0%,#f59e42 100%)', marginBottom: 16, marginTop: 8 }}
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </button>
      <p style={{ marginTop: 16, textAlign: 'center', fontSize: 15 }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          style={{ marginLeft: 8, color: '#6366f1', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 15 }}
          onClick={() => setIsLogin((v) => !v)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
}
