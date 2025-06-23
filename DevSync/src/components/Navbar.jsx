import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { FiLogIn, FiUser, FiLogOut } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-1px' }}>
        DevSync
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NavLink to="/dashboard" className={({ isActive }) => styles.navbar + ' ' + (isActive ? styles.active : '')}>Explore</NavLink>
        <NavLink to="/my-projects" className={({ isActive }) => styles.navbar + ' ' + (isActive ? styles.active : '')}>My Projects</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => styles.navbar + ' ' + (isActive ? styles.active : '')}><FiUser /> Profile</NavLink>
            <button onClick={handleLogout} className={styles.logoutButton} style={{ marginLeft: '1rem' }}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className={styles.navbar} style={{ marginLeft: '1rem' }}>
            <FiLogIn /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}
