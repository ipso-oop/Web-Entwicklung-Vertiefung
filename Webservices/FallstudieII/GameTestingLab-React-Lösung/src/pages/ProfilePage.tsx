import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { authState } = useAuth();

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const user = authState.user!;


  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-gray-700 p-6 md:w-64">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="mt-4 px-3 py-1 text-sm text-white bg-blue-600 rounded-full capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;