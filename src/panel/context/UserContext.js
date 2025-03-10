import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.expirationTime > new Date().getTime()) {
      return savedUser;
    } else {
      localStorage.removeItem('user');
      return { username: 'Guest' };
    }
  });

  useEffect(() => {
    const checkExpiration = () => {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser && savedUser.expirationTime <= new Date().getTime()) {
        setUser({ username: 'Guest' });
        localStorage.removeItem('user');
      }
    };

    const interval = setInterval(checkExpiration, 60 * 1000); // her dakika kontrol et

    return () => clearInterval(interval);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
