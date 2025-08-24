import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import store from '../utils/store';
import { Tab, TabGroup } from '../types';


type TabsContextType = {
  tabs: Tab[];
  groups: TabGroup[];
  activeTabId: string | null;
  addTab: (url?: string, groupId?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;
  duplicateTab: (id: string) => void;
  createGroup: (name: string, color: string) => string;
  updateGroup: (id: string, updates: Partial<TabGroup>) => void;
  deleteGroup: (id: string) => void;
  addTabToGroup: (tabId: string, groupId: string) => void;
  removeTabFromGroup: (tabId: string) => void;
  toggleGroupCollapsed: (groupId: string) => void;
  closeTabsInGroup: (groupId: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>(store.get('tabs', []));
  const [groups, setGroups] = useState<TabGroup[]>(store.get('groups', []));
  const [activeTabId, setActiveTabId] = useState<string | null>(store.get('activeTabId', null));

  useEffect(() => {
    store.set('tabs', tabs);
    store.set('groups', groups);
    store.set('activeTabId', activeTabId);
  }, [tabs, groups, activeTabId]);

  const addTab = (url: string = 'https://www.google.com', groupId?: string) => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url,
      loading: true,
      canGoBack: false,
      canGoForward: false,
      groupId,
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
      addTab(tabToDuplicate.url, tabToDuplicate.groupId);
    }
  };

  const createGroup = (name: string, color: string) => {
    const newGroup: TabGroup = {
      id: `group-${Date.now()}`,
      name,
      color,
      collapsed: false,
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    return newGroup.id;
  };

  const updateGroup = (id: string, updates: Partial<TabGroup>) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      )
    );
  };

  const deleteGroup = (id: string) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.groupId === id ? { ...tab, groupId: undefined } : tab
      )
    );
  };

  const addTabToGroup = (tabId: string, groupId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId ? { ...tab, groupId } : tab
      )
    );
  };

  const removeTabFromGroup = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId ? { ...tab, groupId: undefined } : tab
      )
    );
  };

  const toggleGroupCollapsed = (groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      )
    );
  };

  const closeTabsInGroup = (groupId: string) => {
    const tabsInGroup = tabs.filter((tab) => tab.groupId === groupId);
    const tabIdsToClose = tabsInGroup.map((tab) => tab.id);

    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => !tabIdsToClose.includes(tab.id));

      if (tabIdsToClose.includes(activeTabId!)) {
        const lastTabInGroupIndex = prevTabs.findIndex(t => t.id === tabIdsToClose[tabIdsToClose.length -1]);
        const newActiveTab = newTabs[Math.min(lastTabInGroupIndex, newTabs.length - 1)] || null;
        setActiveTabId(newActiveTab?.id || null);
      }

      return newTabs;
    });
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        groups,
        activeTabId,
        addTab,
        closeTab,
        setActiveTab,
        updateTab,
        closeAllTabs,
        closeOtherTabs,
        duplicateTab,
        createGroup,
        updateGroup,
        deleteGroup,
        addTabToGroup,
        removeTabFromGroup,
        toggleGroupCollapsed,
        closeTabsInGroup,
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
