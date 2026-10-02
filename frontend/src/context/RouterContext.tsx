import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  params: {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialPath = (): string => {
    // If hash routing is used (e.g., #/dashboard)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.slice(1);
    }
    // Standard pathname
    const path = window.location.pathname;
    return path && path !== '' ? path : '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    try {
      window.history.pushState({}, '', path);
    } catch {
      // In restricted iframe environments, pushState might fail, fallback to hash
      window.location.hash = path;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setCurrentPath(window.location.hash.slice(1));
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    const handleHashChange = () => {
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        setCurrentPath(window.location.hash.slice(1));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Compute route parameters (e.g. /prediction/:id)
  const params = useMemo<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    const match = currentPath.match(/^\/prediction\/([^/]+)$/);
    if (match && match[1] !== 'new') {
      result.id = match[1];
    }
    return result;
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};
