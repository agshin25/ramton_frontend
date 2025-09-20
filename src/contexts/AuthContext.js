import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginMutation, useLogoutMutation, useGetMeQuery } from '../services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // API hooks
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: userData, error: userError, isLoading: isUserLoading } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('authToken'),
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Token exists, verify it by fetching user data
          // The useGetMeQuery will handle this automatically
          // If the token is invalid, the query will fail and clearAuthData will be called
          // Don't set isLoading to false here, let the useGetMeQuery handle it
          return;
        } else {
          // No token, clear any existing auth data
          clearAuthData();
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthData();
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle user data from API
  useEffect(() => {
    if (userData?.success && userData?.data) {
      setUser(userData.data);
      setIsAuthenticated(true);
      setAuthError(null);
      setIsLoading(false);
    } else if (userError && !isUserLoading) {
      // Only clear auth data if we're not still loading and there's an actual error
      console.log('Token validation failed:', userError);
      
      // Check if it's a 401 error (unauthorized)
      if (userError.status === 401) {
        clearAuthData();
        // Redirect to login page
        window.location.href = "/login";
      } else {
        clearAuthData();
      }
    }
  }, [userData, userError, isUserLoading]);

  const clearAuthData = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('ramton_auth');
  };

  // Function to validate token on demand
  const validateToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      clearAuthData();
      return false;
    }
    
    // This will trigger the useGetMeQuery which will validate the token
    // If the token is invalid, the query will fail and clearAuthData will be called
    return true;
  };

  const login = async (credentials) => {
    try {
      setAuthError(null);
      const response = await loginMutation(credentials).unwrap();
      
      // Handle the actual API response format: { success: true, message: "...", data: { token: "...", user: {...} } }
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('authToken', token);
        
        // Store user data for quick access
        localStorage.setItem('ramton_auth', JSON.stringify({
          user: userData,
          token: token,
          isAuthenticated: true
        }));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, data: userData };
      } else {
        throw new Error(response.message || 'Login failed - unexpected response format');
      }
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated) {
        await logoutMutation().unwrap();
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      clearAuthData();
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading: isLoading || isUserLoading,
    isLoggingIn,
    isLoggingOut,
    authError,
    login,
    logout,
    clearAuthData,
    validateToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 