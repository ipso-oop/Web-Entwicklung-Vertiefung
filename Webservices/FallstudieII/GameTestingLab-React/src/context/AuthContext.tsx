import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthState, User } from '../types';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// BUG: Token is not properly refreshed, causing session timeouts
// This should be discovered by students

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'REGISTER_SUCCESS' | 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' | 'LOGIN_FAIL' | 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' | 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const loadUser = async () => {
      if (!authState.token) {
        dispatch({ type: 'AUTH_ERROR', payload: 'No token' });
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
      }
    };

    if (authState.token) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: 'Please log in' });
    }
  }, [authState.token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: errorMsg });
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: errorMsg });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};