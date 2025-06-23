import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../utils/api';
import styles from '../pages/CreateProjectPage.module.css';

export default function CreateProjectForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillsArray = requiredSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);

    try {
      const res = await createProject({ title, description, requiredSkills: skillsArray, githubUrl });
      navigate(`/project/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-12 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mt-10 mb-10">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-8 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Project Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
            placeholder="e.g., AI-Powered Chatbot"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Project Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className={styles.textarea}
            placeholder="Describe your project's goals and features."
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="skills" className={styles.label}>
            Required Skills
          </label>
          <input
            id="skills"
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
            className={styles.input}
            placeholder="e.g., React, Node.js, Python"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Please provide a comma-separated list of skills.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="githubUrl" className={styles.label}>
            GitHub Repository URL (Optional)
          </label>
          <input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className={styles.input}
            placeholder="https://github.com/username/repository"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Link to your project's GitHub repository if available.
          </p>
        </div>

        <div className={styles.formGroup}>
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
