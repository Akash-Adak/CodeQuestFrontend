import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/room'); // go to dashboard/room
    } else {
      navigate('/login'); // error fallback
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Signing you in...</h2>
    </div>
  );
};

export default OAuth2Success;
