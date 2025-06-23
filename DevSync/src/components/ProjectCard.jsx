import { Link } from 'react-router-dom';
import { FiPlusCircle, FiArrowRight, FiUsers, FiClock, FiStar, FiGithub } from 'react-icons/fi';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, handleApply, isApplying, showApplyButton }) {
  return (
    <div className={styles.projectCard}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.sparkle}><div className={styles.sparkleDot}></div></div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{project.title}</h3>
        
        <p className={styles.description}>{project.description}</p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <FiUsers className={`${styles.statIcon} ${styles.iconGreen}`} />
            <span>{project.members?.length || 0} members</span>
          </div>
          <div className={styles.statItem}>
            <FiClock className={`${styles.statIcon} ${styles.iconOrange}`} />
            <span>Active</span>
          </div>
          {project.githubUrl && (
            <div className={styles.statItem}>
              <FiGithub className={`${styles.statIcon} ${styles.iconPurple}`} />
              <span>GitHub</span>
            </div>
          )}
          <div className={styles.statItem}>
            <FiStar className={`${styles.statIcon} ${styles.iconYellow}`} />
            <span>New</span>
          </div>
        </div>
        
        <div className={styles.skillsContainer}>
          <h4 className={styles.skillsTitle}>
            <span className={styles.skillsTitlePulse}></span>
            Required Skills:
          </h4>
          <div className={styles.skillsList}>
            {project.requiredSkills?.slice(0, 3).map((skill, index) => (
              <span 
                key={skill} 
                className={styles.skillTag}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {skill}
              </span>
            ))}
            {project.requiredSkills?.length > 3 && (
              <span className={`${styles.skillTag} ${styles.moreSkillsTag}`}>
                +{project.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className={styles.cardActions}>
          <Link to={`/project/${project._id}`} className={styles.actionButton} state={{ project }}>
            <span>View Details</span>
            <FiArrowRight className={styles.actionButtonIcon} />
          </Link>
          
          {showApplyButton && (
            <button 
              onClick={() => handleApply(project._id)}
              disabled={isApplying}
              className={`${styles.actionButton} ${styles.applyButton}`}
            >
              <FiPlusCircle className={styles.applyButtonIcon} />
              {isApplying ? 'Applying...' : 'Apply to Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 