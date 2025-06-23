import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ArrowRightCircleIcon, SparklesIcon, RocketIcon, UsersIcon, CodeIcon } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.homeContainer}>
      
      {/* 🌈 Animated Background Elements */}
      <div className={`${styles.animatedBlob} ${styles.blob1}`} />
      <div className={`${styles.animatedBlob} ${styles.blob2}`} />
      <div className={`${styles.animatedBlob} ${styles.blob3}`} />
      <div className={`${styles.animatedBlob} ${styles.blob4}`} />
      
      {/* ✨ Sparkle Effects */}
      <div className={`${styles.sparkle} ${styles.sparkle1}`}>
        <SparklesIcon className={styles.sparkleIcon} />
      </div>
      <div className={`${styles.sparkle} ${styles.sparkle2}`}>
        <SparklesIcon className={styles.sparkleIcon} />
      </div>
      <div className={`${styles.sparkle} ${styles.sparkle3}`}>
        <SparklesIcon className={styles.sparkleIcon} />
      </div>

      {/* 💫 Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to DevSync
          </h1>
          <div className={styles.iconsContainer}>
            <RocketIcon className={`${styles.icon} ${styles.iconRocket}`} />
            <UsersIcon className={`${styles.icon} ${styles.iconUsers}`} />
            <CodeIcon className={`${styles.icon} ${styles.iconCode}`} />
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>
            <span className={`${styles.highlight} ${styles.highlightGreen}`}>Collaborate</span>, <span className={`${styles.highlight} ${styles.highlightBlue}`}>build</span>, and <span className={`${styles.highlight} ${styles.highlightPink}`}>grow</span> with like-minded developers. 
            Start or join real-world projects, chat in real-time, and manage tasks—all in one place.
          </p>
        </div>

        {/* 🎯 Feature Highlights */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIconContainer} ${styles.users}`}>
              <UsersIcon className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Team Collaboration</h3>
            <p className={styles.featureDescription}>Work together seamlessly with real-time chat and project management</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={`${styles.featureIconContainer} ${styles.code}`}>
              <CodeIcon className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Project Building</h3>
            <p className={styles.featureDescription}>Create and manage projects with task tracking and progress monitoring</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={`${styles.featureIconContainer} ${styles.rocket}`}>
              <RocketIcon className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Skill Growth</h3>
            <p className={styles.featureDescription}>Learn from peers and build your portfolio with real-world experience</p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className={styles.ctaContainer}>
            <Link to="/dashboard">
              <button className={`${styles.ctaButton} ${styles.dashboard}`}>
                <span>Go to Dashboard</span>
                <ArrowRightCircleIcon className={styles.icon} />
                <div className={styles.overlay}></div>
              </button>
            </Link>
          </div>
        ) : (
          <div className={styles.ctaContainer}>
            <Link to="/auth">
              <button className={`${styles.ctaButton} ${styles.getStarted}`}>
                <span>Get Started</span>
                <ArrowRightCircleIcon className={styles.icon} />
                <div className={styles.overlay}></div>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
