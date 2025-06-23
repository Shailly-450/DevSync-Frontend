import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { fetchProjects, applyToProject, getRecommendedProjects } from "../utils/api";
import { useAuth } from "../App";
import { FiPlusCircle, FiSearch } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import ProjectCard from '../components/ProjectCard';
import styles from './Projects.module.css';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const [projectsRes, recommendedRes] = await Promise.all([
          fetchProjects(),
          getRecommendedProjects()
        ]);
        setProjects(projectsRes.data);
        setRecommendedProjects(recommendedRes.data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleApply = async (projectId) => {
    setApplying(projectId);
    try {
      await applyToProject(projectId);
      alert('Application successful! The project owner has been notified.');
      // Optional: Update UI to show "Pending" status
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply. Please try again.');
    } finally {
      setApplying(null);
    }
  };
  
  const isMemberOrCreator = (project) => {
    return project.members.some(m => m._id === user?._id) || project.creator === user?._id;
  }

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className={styles.loader}>Loading projects...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const userProjectIds = new Set(projects.filter(p => p.creator._id === user?._id || p.members.some(m => m._id === user?._id)).map(p => p._id));
  const otherProjects = projects.filter(p => !userProjectIds.has(p._id));
  const projectsToDisplay = otherProjects.filter(p => !recommendedProjects.some(rec => rec._id === p._id));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Projects</h1>
        <Link to="/projects/new" className={styles.createButton}>
          <FiPlusCircle /> Create Project
        </Link>
      </header>

      {recommendedProjects.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recommended for You</h2>
          <div className={styles.projectGrid}>
            {recommendedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                handleApply={handleApply}
                isApplying={applying === project._id}
                showApplyButton={!userProjectIds.has(project._id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Projects</h2>
        <div className={styles.projectGrid}>
          {projectsToDisplay.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              handleApply={handleApply}
              isApplying={applying === project._id}
              showApplyButton={!userProjectIds.has(project._id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
