import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'Ideation',
    supportRequired: ''
  });
  const [commentInputs, setCommentInputs] = useState({});
  // NEW: State for milestone inputs
  const [milestoneInputs, setMilestoneInputs] = useState({});

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { 'x-auth-token': token }
      });
      setFormData({ title: '', description: '', stage: 'Ideation', supportRequired: '' });
      fetchProjects(); 
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  const handleCommentChange = (projectId, text) => {
    setCommentInputs({ ...commentInputs, [projectId]: text });
  };

  const submitComment = async (projectId) => {
    if (!commentInputs[projectId]) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/comment/${projectId}`, {
        text: commentInputs[projectId]
      }, { headers: { 'x-auth-token': token } });
      setCommentInputs({ ...commentInputs, [projectId]: '' });
      fetchProjects(); 
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  // NEW: Handle milestone input change
  const handleMilestoneChange = (projectId, text) => {
    setMilestoneInputs({ ...milestoneInputs, [projectId]: text });
  };

  // NEW: Send progress updates to the backend
  const updateProjectProgress = async (projectId, newStage, newMilestone) => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {};
      if (newStage) updateData.stage = newStage;
      if (newMilestone) updateData.milestone = newMilestone;

      await axios.put(`http://localhost:5000/api/projects/${projectId}`, updateData, {
        headers: { 'x-auth-token': token }
      });

      if (newMilestone) {
        setMilestoneInputs({ ...milestoneInputs, [projectId]: '' });
      }
      fetchProjects(); // Refresh to show updates
    } catch (err) {
      // If the backend blocks it (e.g., they don't own the project), show an alert
      alert(err.response?.data?.message || 'Error updating progress');
    }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>Developer Dashboard</h2>
      
      <div style={styles.card}>
        <h3 style={{ marginBottom: '15px' }}>Share What You're Building</h3>
        <form onSubmit={handleCreateProject} style={styles.form}>
          <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="What is this project about?" value={formData.description} onChange={handleChange} required rows="3" />
          <div style={{ display: 'flex', gap: '10px' }}>
            <select name="stage" value={formData.stage} onChange={handleChange} style={{ flex: 1 }}>
              <option value="Ideation">Ideation</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Completed">Completed</option>
            </select>
            <input type="text" name="supportRequired" placeholder="Support Needed? (e.g., Need a UI Designer)" value={formData.supportRequired} onChange={handleChange} style={{ flex: 2 }} />
          </div>
          <button type="submit">Post to Live Feed</button>
        </form>
      </div>

      <h3 style={{ marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Live Feed</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No projects found. Be the first to post!</p>
        ) : (
          projects.map(project => (
            <div key={project._id} style={styles.projectCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-green)' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Built by {project.user.name}</p>
                </div>
                <span style={styles.badge}>{project.stage}</span>
              </div>
              
              <p style={{ marginTop: '15px' }}>{project.description}</p>
              
              {project.supportRequired && project.supportRequired !== 'None' && (
                <div style={styles.supportBox}>
                  <strong>🙋 Support Needed:</strong> {project.supportRequired}
                </div>
              )}

              {/* NEW: Milestones Section */}
              <div style={styles.milestoneBox}>
                <h4 style={{ color: 'var(--text-white)', marginBottom: '10px', fontSize: '0.9em' }}>🏆 Milestones Achieved</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--primary-green)', fontSize: '0.9em', marginBottom: '10px' }}>
                  {project.milestones && project.milestones.map((m, index) => (
                    <li key={index}>{m.text}</li>
                  ))}
                </ul>
                
                {/* Inputs to update progress */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Log a new milestone..." 
                    value={milestoneInputs[project._id] || ''}
                    onChange={(e) => handleMilestoneChange(project._id, e.target.value)}
                    style={{ flex: 2, margin: 0, padding: '8px' }}
                  />
                  <button onClick={() => updateProjectProgress(project._id, null, milestoneInputs[project._id])} style={{ padding: '8px 15px' }}>Add</button>
                  
                  <select 
                    value={project.stage} 
                    onChange={(e) => updateProjectProgress(project._id, e.target.value, null)}
                    style={{ flex: 1, margin: 0, padding: '8px' }}
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Comments Section */}
              <div style={styles.commentSection}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.9em' }}>Collaboration & Comments</h4>
                {project.comments.map((comment, index) => (
                  <div key={index} style={styles.commentBubble}>
                    <strong>Developer:</strong> {comment.text}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Offer to help or leave a comment..." 
                    value={commentInputs[project._id] || ''}
                    onChange={(e) => handleCommentChange(project._id, e.target.value)}
                    style={{ flex: 1, margin: 0, padding: '8px' }}
                  />
                  <button onClick={() => submitComment(project._id)} style={{ padding: '8px 15px' }}>Send</button>
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  card: { backgroundColor: 'var(--card-black)', padding: '20px', borderRadius: '8px', border: '1px solid #333' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  projectCard: { backgroundColor: 'var(--card-black)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-green)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  badge: { backgroundColor: '#333', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8em', fontWeight: 'bold' },
  supportBox: { marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', border: '1px dashed var(--text-muted)', borderRadius: '4px', color: '#e2e8f0' },
  milestoneBox: { marginTop: '15px', padding: '15px', backgroundColor: '#121212', borderRadius: '4px', border: '1px solid #333' },
  commentSection: { marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' },
  commentBubble: { backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '4px', marginBottom: '8px', fontSize: '0.9em', borderLeft: '2px solid #555' }
};

export default Dashboard;