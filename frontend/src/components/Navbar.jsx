import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // We will store the JWT here later

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2><Link to="/dashboard" style={{ color: 'var(--text-white)' }}>Mzansi<span style={{ color: 'var(--primary-green)' }}>Builds</span></Link></h2>
      <div>
        {token ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Derivco Assessment</span>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'var(--card-black)',
    borderBottom: '2px solid var(--primary-green)'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--primary-green)',
    color: 'var(--primary-green)',
  }
};

export default Navbar;