import React, { createContext, useContext, useState, ReactNode } from 'react';

type Tab = {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

type TabsContextType = {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
  duplicateTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const addTab = (url: string = 'https://www.google.com') => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url,
      loading: true,
      canGoBack: false,
      canGoForward: false,
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
    return newTab.id;
  };

  const closeTab = (id: string) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.id !== id);
      
      // If we're closing the active tab and there are other tabs
      if (id === activeTabId) {
        const closedTabIndex = prevTabs.findIndex((tab) => tab.id === id);
        const newActiveTab = 
          newTabs[Math.min(closedTabIndex, newTabs.length - 1)] || null;
        setActiveTabId(newActiveTab?.id || null);
      }
      
      return newTabs;
    });
  };

  const setActiveTab = (id: string) => {
    if (tabs.some((tab) => tab.id === id)) {
      setActiveTabId(id);
    }
  };

  const updateTab = (id: string, updates: Partial<Tab>) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, ...updates } : tab
      )
    );
  };

  const closeAllTabs = () => {
    setTabs([]);
    setActiveTabId(null);
  };

  const closeOtherTabs = (id: string) => {
    const tabToKeep = tabs.find((tab) => tab.id === id);
    if (tabToKeep) {
      setTabs([tabToKeep]);
      setActiveTabId(id);
    }
  };

  const duplicateTab = (id: string) => {
    const tabToDuplicate = tabs.find((tab) => tab.id === id);
    if (tabToDuplicate) {
      addTab(tabToDuplicate.url);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        setActiveTab,
        updateTab,
        closeAllTabs,
        closeOtherTabs,
        duplicateTab,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};
