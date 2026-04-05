import { useState, useEffect } from 'react';
import axios from 'axios';

const CelebrationWall = () => {
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    const fetchCelebrationWall = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/projects/celebration/wall', {
          headers: { 'x-auth-token': token }
        });
        setCompletedProjects(res.data);
      } catch (err) {
        console.error('Error fetching celebration wall', err);
      }
    };

    fetchCelebrationWall();
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'var(--primary-green)', marginBottom: '10px', fontSize: '2.5rem' }}>
        🎉 The Celebration Wall 🎉
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
        Honoring the developers who built in public and crossed the finish line.
      </p>

      <div style={styles.grid}>
        {completedProjects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No projects have been completed yet. Keep building!</p>
        ) : (
          completedProjects.map(project => (
            <div key={project._id} style={styles.goldCard}>
              <h2 style={{ color: '#ffd700', marginBottom: '10px' }}>{project.title}</h2>
              <p style={{ color: 'var(--text-white)', fontStyle: 'italic', marginBottom: '15px' }}>
                " {project.description} "
              </p>
              <div style={styles.developerTag}>
                Master Builder: <strong>{project.user.name}</strong>
              </div>
              
              {project.milestones && project.milestones.length > 0 && (
                <div style={{ marginTop: '15px', textAlign: 'left' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Key Milestones:</h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#ccc' }}>
                    {project.milestones.map((m, idx) => (
                      <li key={idx}>{m.text}</li>
                    ))}
                  </ul>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  },
  goldCard: {
    backgroundColor: '#1a1a1a',
    padding: '25px',
    borderRadius: '12px',
    border: '2px solid #ffd700', // Gold border for completed projects!
    boxShadow: '0 8px 16px rgba(255, 215, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  developerTag: {
    backgroundColor: 'var(--card-black)',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #333',
    color: 'var(--primary-green)'
  }
};

export default CelebrationWall;