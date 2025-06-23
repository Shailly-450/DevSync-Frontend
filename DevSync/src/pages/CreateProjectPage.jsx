import styles from './CreateProjectPage.module.css';
import CreateProjectForm from '../components/CreateProjectForm';
import BackButton from '../components/BackButton';

export default function CreateProjectPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className="flex items-center gap-4 mb-4">
            <BackButton to="/projects" />
            <div>
              <h1 className={styles.title}>
                🚀 Create New Project
              </h1>
              <p className={styles.subtitle}>
                Start your next big idea and share it with the world!
              </p>
            </div>
          </div>
        </div>
        <CreateProjectForm />
      </div>
    </div>
  );
}
