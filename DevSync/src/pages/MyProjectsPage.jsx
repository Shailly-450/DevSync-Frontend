import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getProjects } from "../utils/api";
import { useAuth } from "../App";
import ProjectCard from '../components/ProjectCard';
import { FiClipboard, FiPlusCircle, FiCompass } from 'react-icons/fi';
import styles from './MyProjectsPage.module.css';
import BackButton from '../components/BackButton';

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getProjects()
      .then((res) => {
        const allProjects = res.data;
        setMyProjects(allProjects.filter(p => 
          p.members.some(m => m._id === user._id) || p.creator._id === user._id
        ));
      })
      .catch(() => setError("Failed to load your projects."))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerBorder}></div>
          <div className={styles.spinnerPulse}></div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className={styles.errorContainer}>{error}</div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className="flex items-center gap-4 mb-4">
            <BackButton to="/dashboard" />
            <div className={styles.titleContainer}>
              <FiClipboard className={styles.titleIcon}/>
              <div>
                  <h1 className={styles.title}>My Projects</h1>
                  <p className={styles.subtitle}>Projects you have created or joined.</p>
              </div>
            </div>
          </div>
        </header>
        
        {myProjects.length > 0 ? (
          <div className={styles.projectsGrid}>
            {myProjects.map((project) => (
              <Link to={`/project/${project._id}`} key={project._id} className={styles.projectLink} state={{ project }}>
                <ProjectCard 
                  project={project} 
                  showApplyButton={false} 
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyStateContainer}>
            <FiClipboard className={styles.emptyStateIcon}/>
            <h3 className={styles.emptyStateTitle}>No Projects Yet</h3>
            <p className={styles.emptyStateText}>
              You haven't created or joined any projects. Explore projects to get started!
            </p>
            <Link to="/dashboard" className={styles.emptyStateButton}>
                <FiCompass />
                Explore Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}