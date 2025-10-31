import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function VerifyPage() {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    api
      .get(`/auth/verify/${token}`)
      .then(() => setMessage('Email verified! You can now login.'))
      .catch(() => setMessage('Verification failed or token expired.'));
  }, [token]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
      <div className="mb-3">{message}</div>
      <Link to="/login" className="text-blue-700">
        Go to Login
      </Link>
    </div>
  );
}
