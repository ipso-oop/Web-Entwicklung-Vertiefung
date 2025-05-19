import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { login, authState, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: {email?: string; password?: string} = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await login(formData.email, formData.password);
        if (!authState.error) {
          navigate('/');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login to Game Testing Lab</h2>
        
        {authState.error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {authState.error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-700 text-white border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-gray-700 text-white border ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-white py-2 px-4 rounded-md font-medium hover:from-yellow-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;