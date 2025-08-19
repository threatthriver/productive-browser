import React, { useState, useRef, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  TextField, 
  InputAdornment, 
  Box, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onThemeChange: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, darkMode, onThemeChange }) => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const webviewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let targetUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      targetUrl = `https://${url}`;
    }
    
    if (webviewRef.current) {
      webviewRef.current.setAttribute('src', targetUrl);
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      const webview = webviewRef.current as unknown as { reload: () => void };
      webview.reload();
    }
  };

  const handleBack = () => {
    if (webviewRef.current && canGoBack) {
      const webview = webviewRef.current as unknown as { goBack: () => void };
      webview.goBack();
    }
  };

  const handleForward = () => {
    if (webviewRef.current && canGoForward) {
      const webview = webviewRef.current as unknown as { goForward: () => void };
      webview.goForward();
    }
  };

  const handleHome = () => {
    if (webviewRef.current) {
      webviewRef.current.setAttribute('src', 'https://www.google.com');
    }
  };

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleDidNavigate = () => {
      const webviewEl = webview as unknown as { getURL: () => string; canGoBack: () => boolean; canGoForward: () => boolean };
      setUrl(webviewEl.getURL());
      setCanGoBack(webviewEl.canGoBack());
      setCanGoForward(webviewEl.canGoForward());
    };

    const handleDidStartLoading = () => setIsLoading(true);
    const handleDidStopLoading = () => setIsLoading(false);

    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-start-loading', handleDidStartLoading);
    webview.addEventListener('did-stop-loading', handleDidStopLoading);

    return () => {
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-start-loading', handleDidStartLoading);
      webview.removeEventListener('did-stop-loading', handleDidStopLoading);
    };
  }, []);

  return (
    <AppBar position="static" elevation={0} color="default">
      <Toolbar variant="dense" sx={{ gap: 1, px: 1 }}>
        {!isMobile && (
          <Tooltip title="Menu">
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={onMenuClick}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Go Back">
          <span>
            <IconButton 
              disabled={!canGoBack} 
              onClick={handleBack}
              size="large"
            >
              <ArrowBackIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Go Forward">
          <span>
            <IconButton 
              disabled={!canGoForward} 
              onClick={handleForward}
              size="large"
            >
              <ArrowForwardIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Reload">
          <IconButton 
            onClick={handleRefresh} 
            disabled={isLoading}
            size="large"
          >
            <RefreshIcon 
              className={isLoading ? 'spin' : ''} 
              style={isLoading ? { animation: 'spin 1s linear infinite' } : {}} 
            />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1, mx: 1 }}>
          <form onSubmit={handleUrlSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search or enter website name"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                style: {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '24px',
                },
              }}
            />
          </form>
        </Box>
        
        <Tooltip title="Home">
          <IconButton onClick={handleHome} size="large">
            <HomeIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Bookmarks">
          <IconButton onClick={() => navigate('/bookmarks')} size="large">
            <BookmarkIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Settings">
          <IconButton onClick={() => navigate('/settings')} size="large">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton onClick={onThemeChange} size="large">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
