import { Link } from 'react-router-dom';

const NavBar = () => {
  // Пока что у нас просто две ссылки для навигации
  return (
    <div style={{ padding: '10px', background: '#222', display: 'flex', gap: '15px' }}>
      <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
      <Link to="/login" style={{ color: 'white' }}>Login</Link>
      <Link to="/lab" style={{ color: 'white' }}>Лаборатория</Link>
    </div>
  );
};

export default NavBar;