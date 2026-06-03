import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  }, []);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sidebar-collapsed') {
        setCollapsed(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
