import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../utils/api";
import BackButton from "../components/BackButton";
import { FiEdit3, FiSave, FiX, FiMail, FiFileText, FiCode, FiGlobe, FiGithub, FiExternalLink } from 'react-icons/fi';
import styles from './Profile.module.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    skills: [],
    github: '',
    portfolio: ''
  });

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setEditForm({
          name: res.data.name || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          github: res.data.github || '',
          portfolio: res.data.portfolio || ''
        });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateProfile(editForm);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      github: profile.github || '',
      portfolio: profile.portfolio || ''
    });
    setIsEditing(false);
  };

  const addSkill = (skill) => {
    if (skill.trim() && !editForm.skills.includes(skill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/20 rounded-lg border border-gray-600/30">
          <p className="text-gray-300">No profile data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {profile.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            {isEditing ? (
              <input
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className={styles.input}
                style={{ fontSize: '1.5rem', fontWeight: '700' }}
              />
            ) : (
              <div className={styles.title}>{profile.name}</div>
            )}
            <div className={styles.email}><FiMail size={16} />{profile.email}</div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FiFileText />About</div>
          {isEditing ? (
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className={profile.bio ? styles.bio : styles.noBio}>
              {profile.bio || 'No bio added yet.'}
            </div>
          )}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FiCode />Skills</div>
          {isEditing ? (
            <div>
              <div className={styles.skillsInputContainer}>
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className={styles.input}
                />
              </div>
              <div className={styles.skillsList}>
                {editForm.skills.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>
                    {skill}
                    <button onClick={() => removeSkill(skill)} className={styles.removeSkillBtn}>
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.skillsList}>
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))
              ) : (
                <span className={styles.noBio}>No skills added yet.</span>
              )}
            </div>
          )}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FiGithub />GitHub</div>
          {isEditing ? (
            <input
              name="github"
              value={editForm.github}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="https://github.com/your-username"
            />
          ) : (
            profile.github ? (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {profile.github}
                <FiExternalLink size={14} />
              </a>
            ) : (
              <span className={styles.noBio}>No GitHub profile added.</span>
            )
          )}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}><FiGlobe />Portfolio</div>
          {isEditing ? (
            <input
              name="portfolio"
              value={editForm.portfolio}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="https://your-portfolio.com"
            />
          ) : (
            profile.portfolio ? (
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {profile.portfolio}
                <FiExternalLink size={14} />
              </a>
            ) : (
              <span className={styles.noBio}>No portfolio added.</span>
            )
          )}
        </div>
        <div style={{display:'flex', gap:'1rem', marginTop:'1.5rem'}}>
          {isEditing ? (
            <>
              <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : <><FiSave /> Save Changes</>}
              </button>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancel}>
                <FiX /> Cancel
              </button>
            </>
          ) : (
            <button className={styles.button} onClick={() => setIsEditing(true)}><FiEdit3 />Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}