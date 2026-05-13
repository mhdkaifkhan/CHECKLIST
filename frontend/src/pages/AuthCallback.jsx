import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const [params]  = useSearchParams();
  const { setToken } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      toast.error('Google sign-in failed. Please try again.');
      navigate('/');
      return;
    }

    if (token) {
      setToken(token);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Authentication failed.');
      navigate('/');
    }
  }, []);

  return <PageLoader />;
}
