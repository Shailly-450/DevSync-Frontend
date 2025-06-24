import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getProjects, applyToProject, getRecommendedProjects } from "../utils/api";
import { useAuth } from "../App";
import { FiSearch, FiBriefcase, FiPlusCircle, FiCompass, FiTrendingUp, FiUsers, FiStar, FiThumbsUp } from 'react-icons/fi';
import ProjectCard from '../components/ProjectCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [projectsRes, recommendedRes] = await Promise.all([
          getProjects(),
          getRecommendedProjects()
        ]);
        
        const allProjects = projectsRes.data;
        const recommendations = recommendedRes.data;
        
        const explorable = allProjects.filter(p => !p.members.some(m => m._id === user._id));
        
        setProjects(explorable);
        setFilteredProjects(explorable);
        setRecommendedProjects(recommendations);
        
      } catch (err) {
        setError("Failed to load projects.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    // Exclude recommended projects from the main list
    const recommendedIds = new Set(recommendedProjects.map(p => p._id));
    const mainProjects = projects.filter(p => !recommendedIds.has(p._id));

    const filtered = mainProjects.filter(project => {
      return (
        project.title.toLowerCase().includes(lowercasedFilter) ||
        project.description.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredProjects(filtered);
  }, [searchTerm, projects, recommendedProjects]);

  const handleApply = async (projectId) => {
    setApplying(prev => ({ ...prev, [projectId]: true }));
    try {
      await applyToProject(projectId);
      alert('Application successful! The project owner has been notified.');
      const updatedProjects = projects.filter(p => p._id !== projectId);
      setProjects(updatedProjects);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply. Please try again.');
    } finally {
      setApplying(prev => ({ ...prev, [projectId]: false }));
    }
  };

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
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      {error}
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <div className={`${styles.backgroundBlobs} ${styles.blob1}`} />
      <div className={`${styles.backgroundBlobs} ${styles.blob2}`} />
      
      <div className={styles.contentWrapper}>
        
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.title}>Explore Projects</h1>
              <p className={styles.subtitle}>Find your next great collaboration and build amazing things together.</p>
              
              <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                  <FiTrendingUp className={`${styles.statIcon} ${styles.green}`} />
                  <span className={styles.statValue}>{projects.length}</span>
                  <span className={styles.statLabel}>Active Projects</span>
                </div>
                <div className={`${styles.statCard} ${styles.pink}`}>
                  <FiUsers className={`${styles.statIcon} ${styles.pink}`} />
                  <span className={styles.statValue}>100+</span>
                  <span className={styles.statLabel}>Developers</span>
                </div>
                <div className={`${styles.statCard} ${styles.orange}`}>
                  <FiStar className={`${styles.statIcon} ${styles.yellow}`} />
                  <span className={styles.statValue}>50+</span>
                  <span className={styles.statLabel}>Completed</span>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <Link to="/my-projects" className={styles.actionButton}>
                <FiBriefcase className={styles.actionIcon} />
                My Projects
              </Link>
              <Link to="/projects/new" className={`${styles.actionButton} ${styles.createButton}`}>
                <FiPlusCircle className={styles.actionIcon} />
                Create Project
              </Link>
            </div>
          </div>
        </header>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FiSearch className={styles.searchIcon} />
          <div className={styles.searchGlow}></div>
        </div>

        {recommendedProjects.length > 0 && (
          <section className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>
              <FiThumbsUp /> Recommended for You
            </h2>
            <div className={styles.projectsGrid}>
              {recommendedProjects.map((project, index) => (
                <div 
                  key={project._id}
                  className={styles.projectCardWrapper}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <ProjectCard 
                    project={project} 
                    handleApply={handleApply}
                    isApplying={applying[project._id]}
                    showApplyButton={true}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.projectsSection}>
           <h2 className={styles.sectionTitle}>
              <FiCompass /> All Projects
            </h2>
          {filteredProjects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project, index) => (
                <div 
                  key={project._id}
                  className={styles.projectCardWrapper}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <ProjectCard 
                    project={project} 
                    handleApply={handleApply}
                    isApplying={applying[project._id]}
                    showApplyButton={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProjectsContainer}>
              <div className={styles.noProjectsIconContainer}>
                <FiCompass className={styles.noProjectsIcon} />
                <div className={styles.noProjectsPulse}></div>
              </div>
              <h3 className={styles.noProjectsTitle}>No Projects Found</h3>
              <p className={styles.noProjectsText}>
                {searchTerm ? "Try a different search term or check back later for new opportunities!" : "No new projects to join right now. Check back later for exciting collaborations!"}
              </p>
              {!searchTerm && (
                <div className={styles.noProjectsButtonContainer}>
                  <Link to="/projects/new">
                    <button className={styles.noProjectsButton}>
                      Be the First to Create!
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
