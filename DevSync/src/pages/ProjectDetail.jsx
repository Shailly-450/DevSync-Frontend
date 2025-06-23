import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { fetchProject, fetchTasks, createTask, updateTask, getProjectApplications, acceptApplication, rejectApplication, deleteProject } from "../utils/api";
import { useAuth } from "../App";
import { FiUserCheck, FiUserX, FiSend, FiUsers, FiClipboard, FiInbox, FiChevronDown, FiChevronUp, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import styles from './ProjectDetail.module.css';
import BackButton from '../components/BackButton';

export default function ProjectDetail({ projectId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(location.state?.project || null);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [showApplications, setShowApplications] = useState(false);
  
  const isCreator = project?.creator?._id === user?._id;
  const isMember = project?.members?.some(m => m._id === user?._id) || isCreator;

  // Determine where to go back to based on user's role
  const getBackToPath = () => {
    // If project is still loading, default to dashboard
    if (!project) {
      return '/dashboard';
    }
    
    // Check if user is the creator of this project
    const userIsCreator = project.creator?._id === user?._id;
    
    if (userIsCreator) {
      return '/my-projects';
    }
    return '/projects';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Always try fetching fresh data. This is important for members to get latest updates.
        const projectRes = await fetchProject(projectId);
        const freshProject = projectRes.data;
        setProject(freshProject);

        const freshIsMember = freshProject.members.some(m => m._id === user._id) || freshProject.creator._id === user._id;
        const freshIsCreator = freshProject.creator._id === user._id;

        if (freshIsMember) {
          const tasksRes = await fetchTasks(projectId);
          setTasks(tasksRes.data);
        }
        if (freshIsCreator) {
          const appsRes = await getProjectApplications(projectId);
          setApplications(appsRes.data);
        }
      } catch (err) {
        // If the fetch fails, we don't show an error if we already have project data from the link state.
        // This allows non-members to view the project details without getting a scary error message.
        if (!location.state?.project) {
          setError("Failed to load project data. You may not have permission to view this project.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, user, location.state?.project]);

  const handleApplication = async (appId, action) => {
    try {
      const actionFunc = action === 'accept' ? acceptApplication : rejectApplication;
      await actionFunc(appId);
      // After action, refetch all data to update UI correctly
      const projectRes = await fetchProject(projectId);
      setProject(projectRes.data);
      const appsRes = await getProjectApplications(projectId);
      setApplications(appsRes.data);
    } catch (err) {
      alert(`Failed to ${action} application.`);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to permanently delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        alert('Project deleted successfully.');
        navigate('/my-projects');
      } catch (err) {
        alert('Failed to delete project.');
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await createTask(projectId, { title: newTask });
      setNewTask("");
      const tasksRes = await fetchTasks(projectId);
      setTasks(tasksRes.data);
    } catch (error) {
      alert('Failed to add task.');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(projectId, taskId, { status });
      const tasksRes = await fetchTasks(projectId);
      setTasks(tasksRes.data);
    } catch (error) {
      alert('Failed to update task.');
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');

  if (loading) return <div className={styles.pageLoader}>Loading project details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!project) return <div className={styles.pageLoader}>Project not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className="flex items-center gap-4 mb-4">
            <BackButton to={getBackToPath()} />
            <div className={styles.headerInfo}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {isMember && (
              <Link to={`/project/${projectId}/chat`}>
                  <button className={`${styles.actionButton} ${styles.chatButton}`} title="Open project chat">
                    <FiMessageSquare />
                    Chat
                  </button>
              </Link>
            )}
            {isCreator && (
              <button 
                onClick={handleDeleteProject}
                className={`${styles.actionButton} ${styles.deleteButton}`}
                title="Delete this project"
              >
                <FiTrash2 />
                Delete
              </button>
            )}
          </div>
        </div>
        <div className={styles.skillsList}>
          <span className={styles.listTitle}>Required Skills:</span>
          {project.requiredSkills?.map((skill) => (
            <span key={skill} className={styles.skillTag}>{skill}</span>
          ))}
        </div>
        
        {project.githubUrl && (
          <div className={styles.githubSection}>
            <span className={styles.listTitle}>GitHub Repository:</span>
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              {project.githubUrl}
            </a>
          </div>
        )}
        
        <div className={styles.membersList}>
            <span className={styles.listTitle}><FiUsers /> Team Members:</span>
            {project.members?.map((member) => (
              <span key={member._id} className={styles.memberTag}>{member.name}</span>
            ))}
        </div>
      </div>

      {isCreator && (
        <section className={styles.card}>
          <div className={styles.header}>
            <h3 className={styles.sectionTitle}>
              <FiInbox /> 
              Join Requests 
              {pendingApplications.length > 0 && (
                <span className={styles.badge}>{pendingApplications.length}</span>
              )}
            </h3>
            <button 
              onClick={() => setShowApplications(!showApplications)}
              className={`${styles.actionButton} ${styles.toggleButton}`}
            >
              {showApplications ? <FiChevronUp /> : <FiChevronDown />}
              {showApplications ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showApplications && (
            <div className={styles.applicationList}>
              {pendingApplications.length > 0 ? (
                <ul>
                  {pendingApplications.map(app => (
                    <li key={app._id} className={styles.applicationItem}>
                      <div className={styles.applicantInfo}>
                        <p>{app.applicant.name}</p>
                        <p>{app.applicant.email}</p>
                      </div>
                      <div className={styles.applicationActions}>
                        <button 
                          onClick={() => handleApplication(app._id, 'accept')} 
                          className={`${styles.actionButton} ${styles.acceptButton}`}
                          title="Accept application"
                        >
                          <FiUserCheck />
                        </button>
                        <button 
                          onClick={() => handleApplication(app._id, 'reject')} 
                          className={`${styles.actionButton} ${styles.rejectButton}`}
                          title="Reject application"
                        >
                          <FiUserX />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.emptyState}>
                  <FiInbox />
                  <p>No pending applications.</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {isMember && (
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}><FiClipboard /> Project Tasks</h3>
          <form onSubmit={handleAddTask} className={styles.taskForm}>
            <input
              className={styles.taskInput}
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button type="submit" className={`${styles.actionButton} ${styles.addTaskButton}`}><FiSend /> Add Task</button>
          </form>
          <div className={styles.taskColumns}>
            {['todo', 'inprogress', 'done'].map((status) => (
              <div key={status} className={styles.taskColumn}>
                <h4 className={styles.columnTitle}>{status.replace('inprogress', 'In Progress')}</h4>
                <div className={styles.taskList}>
                  {tasks.filter(t => t.status === status).map((task) => (
                    <div key={task._id} className={styles.taskItem}>
                      <span>{task.title}</span>
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task._id, e.target.value)}
                        className={styles.taskStatusSelect}
                      >
                        <option value="todo">To Do</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
