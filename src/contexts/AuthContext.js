import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// Provides authentication state (isLoggedIn, user info) to all components.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // e.g. { name: 'Alice', email: '...'}
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
