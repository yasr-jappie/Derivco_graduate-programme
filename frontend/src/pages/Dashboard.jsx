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

  // 1. Fetch all projects when the page loads
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

  // 2. Handle typing in the new project form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit a new project to the database
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { 'x-auth-token': token }
      });
      // Clear form and refresh the feed immediately
      setFormData({ title: '', description: '', stage: 'Ideation', supportRequired: '' });
      fetchProjects(); 
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>Developer Dashboard</h2>
      
      {/* Create Project Form */}
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

      {/* The Live Feed */}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'var(--card-black)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  projectCard: {
    backgroundColor: 'var(--card-black)',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '4px solid var(--primary-green)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  badge: {
    backgroundColor: '#333',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.8em',
    fontWeight: 'bold'
  },
  supportBox: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#1a1a1a',
    border: '1px dashed var(--text-muted)',
    borderRadius: '4px',
    color: '#e2e8f0'
  }
};

export default Dashboard;