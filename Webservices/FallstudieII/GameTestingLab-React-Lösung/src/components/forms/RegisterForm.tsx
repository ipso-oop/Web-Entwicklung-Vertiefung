import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { register, authState, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) 
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await register(formData.username, formData.email, formData.password);
        if (!authState.error) {
          navigate('/');
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create your account</h2>
        
        {authState.error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {authState.error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full bg-gray-700 text-white border ${
                errors.username ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
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
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-gray-700 text-white border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-white py-2 px-4 rounded-md font-medium hover:from-yellow-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;