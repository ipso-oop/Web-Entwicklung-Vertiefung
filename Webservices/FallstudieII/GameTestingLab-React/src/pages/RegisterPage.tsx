import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { GhostIcon } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <GhostIcon className="h-12 w-12 text-yellow-400 mb-2" />
        <h1 className="text-3xl font-bold text-white">PacBug Hunter</h1>
      </div>
      
      <RegisterForm />
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;