import { Suspense, lazy, useEffect, useState } from 'react';
import { Box, styled, CircularProgress } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TabsProvider, useTabs } from './contexts/TabsContext';
import TabBar from './components/TabBar';
import TabContent from './components/TabContent';
import Sidebar from './components/Sidebar';

// Lazy load components
const Settings = lazy(() => import('./pages/Settings'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));

// Loading component
const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

// Main browser component that handles tabs
const BrowserTabs = () => {
  const { tabs, activeTabId, addTab, updateTab, setActiveTab } = useTabs();
  const location = useLocation();

  // Add initial tab if none exists
  useEffect(() => {
    if (tabs.length === 0) {
      addTab('https://www.google.com');
    }
  }, []);

  // Handle URL changes from the address bar
  useEffect(() => {
    if (location.pathname === '/browser' && location.search) {
      const params = new URLSearchParams(location.search);
      const url = params.get('url');
      if (url) {
        const existingTab = tabs.find(tab => tab.url === url);
        if (existingTab) {
          setActiveTab(existingTab.id);
        } else {
          addTab(url);
        }
      }
    }
  }, [location, tabs, addTab, setActiveTab]);

  // Render the active tab content
  const renderActiveTab = () => {
    const activeTab = tabs.find(tab => tab.id === activeTabId);
    if (!activeTab) return null;

    return (
      <TabContent
        key={activeTab.id}
        tabId={activeTab.id}
        url={activeTab.url}
        favicon={activeTab.favicon}
        onUrlChange={(url) => updateTab(activeTab.id, { url })}
        onTitleChange={(title) => updateTab(activeTab.id, { title })}
        onLoadingChange={(loading) => updateTab(activeTab.id, { loading })}
        onNavigationState={(canGoBack, canGoForward) => 
          updateTab(activeTab.id, { canGoBack, canGoForward })
        }
        onFaviconChange={(favicon) => updateTab(activeTab.id, { favicon })}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <TabBar />
      <Box sx={{ flexGrow: 1, overflow: 'hidden', minHeight: 0 }}>
        {renderActiveTab()}
      </Box>
    </Box>
  );
};

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
  minHeight: 0,
});

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <TabsProvider>
        <Router>
          <AppContainer>
            <MainContent>
              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<BrowserTabs />} />
                    <Route path="/browser" element={<BrowserTabs />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Suspense>
              </Box>
            </MainContent>
          </AppContainer>
        </Router>
      </TabsProvider>
    </ThemeProvider>
  );
};

export default App;
