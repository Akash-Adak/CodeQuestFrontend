// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OAuthRedirectHandler = () => {
  const [params] = useSearchParams();
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwtToken', token);
      // Optionally, navigate to home or dashboard
      window.location.href = '/landing';
    }
  }, [token]);

  return <div>Logging you in...</div>;
};

export default OAuthRedirectHandler;
