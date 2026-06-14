import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  // Extract path from current hash (e.g. "#/dashboard" -> "/dashboard")
  const getPathFromHash = () => {
    const hash = window.location.hash;
    if (!hash) return '/';
    return hash.substring(1); // remove "#"
  };

  const [currentPath, setCurrentPath] = useState(getPathFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getPathFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Set default hash if none exists
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (path) => {
    window.location.hash = `#${path}`;
  };

  // Helper to parse dynamic route parameters (e.g., "/interview/:id" matching "/interview/123")
  const matchRoute = (pattern) => {
    const pathParts = currentPath.split('/');
    const patternParts = pattern.split('/');

    if (pathParts.length !== patternParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].substring(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, matchRoute }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
export default RouterContext;
