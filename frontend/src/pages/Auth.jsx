import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    techStack: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Handle Login
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
        
      } else {
        // Handle Registration
        const techArray = formData.techStack.split(',').map(tech => tech.trim());
        await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          techStack: techArray
        });
        // After successful registration, switch back to login view
        setIsLogin(true);
        alert('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>
          {isLogin ? 'Developer Login' : 'Join MzansiBuilds'}
        </h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
              <input type="text" name="techStack" placeholder="Tech Stack (e.g. React, Node, Java)" required onChange={handleChange} />
            </>
          )}
          
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          
          <button type="submit" style={{ marginTop: '10px' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={styles.toggleText}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
  },
  card: {
    backgroundColor: 'var(--card-black)',
    padding: '40px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  toggleText: {
    color: 'var(--primary-green)',
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },
  error: {
    color: '#ff4444',
    backgroundColor: '#331111',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};

export default Auth;