import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const authState = useSelector(state => state.auth);

  useEffect(() => {
    // Update user state when Redux auth state changes
    if (authState.isAuthenticated) {
      setUser({
        ...authState.user,
        isPremium: authState.user?.isPremium || false
      });
    } else {
      setUser(null);
    }
  }, [authState]);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 