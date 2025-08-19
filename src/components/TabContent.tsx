import React, { useEffect, useRef } from 'react';
import { Box, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  ArrowForward as ArrowForwardIcon, 
  Refresh as RefreshIcon, 
  Home as HomeIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

interface TabContentProps {
  tabId: string;
  url: string;
  favicon?: string;
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onNavigationState: (canGoBack: boolean, canGoForward: boolean) => void;
  onFaviconChange: (favicon?: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  url,
  favicon,
  onUrlChange,
  onTitleChange,
  onLoadingChange,
  onNavigationState,
  onFaviconChange,
}) => {
  const webviewRef = useRef<WebViewElement>(null);
  const [currentUrl, setCurrentUrl] = React.useState(url);
  const [isLoading, setIsLoading] = React.useState(true);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [searchActive, setSearchActive] = React.useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update parent about navigation state changes
  useEffect(() => {
    onNavigationState(canGoBack, canGoForward);
  }, [canGoBack, canGoForward, onNavigationState]);

  // Update parent about loading state changes
  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleNavigation = (url: string) => {
    if (!url) return;
    
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
      // If it's not a URL, try to search with the default search engine
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }
    
    setCurrentUrl(targetUrl);
    onUrlChange(targetUrl);
  };

  const handleReload = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const handleGoBack = () => {
    if (webviewRef.current && webviewRef.current.canGoBack()) {
      webviewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (webviewRef.current && webviewRef.current.canGoForward()) {
      webviewRef.current.goForward();
    }
  };

  const handleGoHome = () => {
    handleNavigation('https://www.google.com');
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    
    handleNavigation(searchText);
    setShowSearch(false);
    setSearchText('');
  };

  const findInPage = (text: string) => {
    if (!webviewRef.current) return;
    
    if (searchActive) {
      webviewRef.current.stopFindInPage('clearSelection');
      setSearchActive(false);
    } else if (text) {
      webviewRef.current.findInPage(text);
      setSearchActive(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    findInPage(text);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
      setSearchText('');
      findInPage('');
    } else if (e.key === 'Enter' && e.shiftKey) {
      const handleFindPrev = () => {
        if (webviewRef.current && searchText) {
          webviewRef.current.findInPage(searchText);
        }
      };
      handleFindPrev();
    } else if (e.key === 'Enter') {
      const handleFindNext = () => {
        if (webviewRef.current && searchText) {
          webviewRef.current.findInPage(searchText);
        }
      };
      handleFindNext();
    }
  };

  // Set up webview event listeners
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleLoadStop = () => {
      setIsLoading(false);
      updateNavigationState();
    };

    const handleTitleUpdated = (e: Event) => {
      const title = (e as CustomEvent<{title: string}>).detail?.title || '';
      onTitleChange(title);
    };

    const handleDidNavigate = (e: Event) => {
      const url = (e as CustomEvent<{url: string}>).detail?.url || '';
      if (url && url !== 'about:blank') {
        setCurrentUrl(url);
        onUrlChange(url);
      }
    };

    const handleFaviconUpdated = (e: Event) => {
      const icons = (e as CustomEvent<{ favicons: string[] }>).detail?.favicons || [];
      const icon = icons[0];
      onFaviconChange(icon);
    };

    // Use DOM events for webview
    webview.addEventListener('did-start-loading', handleLoadStart as EventListener);
    webview.addEventListener('did-stop-loading', handleLoadStop as EventListener);
    webview.addEventListener('page-title-updated', handleTitleUpdated as EventListener);
    webview.addEventListener('did-navigate', handleDidNavigate as EventListener);
    webview.addEventListener('page-favicon-updated', handleFaviconUpdated as EventListener);

    return () => {
      webview.removeEventListener('did-start-loading', handleLoadStart as EventListener);
      webview.removeEventListener('did-stop-loading', handleLoadStop as EventListener);
      webview.removeEventListener('page-title-updated', handleTitleUpdated as EventListener);
      webview.removeEventListener('did-navigate', handleDidNavigate as EventListener);
      webview.removeEventListener('page-favicon-updated', handleFaviconUpdated as EventListener);
    };
  }, [onTitleChange, onUrlChange]);

  const updateNavigationState = () => {
    if (webviewRef.current) {
      setCanGoBack(webviewRef.current.canGoBack());
      setCanGoForward(webviewRef.current.canGoForward());
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '8px',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'saturate(180%) blur(8px)',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.7)'
        }}
      >
        <Tooltip title="Back">
          <span>
            <IconButton 
              onClick={handleGoBack} 
              disabled={!canGoBack}
              size="small"
              sx={{ mr: 0.5 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Forward">
          <span>
            <IconButton 
              onClick={handleGoForward} 
              disabled={!canGoForward}
              size="small"
              sx={{ mr: 1 }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Reload">
          <span>
            <IconButton 
              onClick={handleReload} 
              disabled={isLoading}
              size="small"
              sx={{ mr: 1 }}
            >
              <RefreshIcon className={isLoading ? 'spin' : ''} />
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{ flexGrow: 1, mx: 1 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNavigation(currentUrl);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {isLoading ? (
                      <RefreshIcon className="spin" fontSize="small" />
                    ) : favicon ? (
                      <Box
                        component="img"
                        src={favicon}
                        alt="favicon"
                        sx={{ width: 14, height: 14, borderRadius: 0.5 }}
                      />
                    ) : (
                      <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'action.hover',
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '1px',
                  },
                },
              }}
            />
          </form>
        </Box>

        <Tooltip title="Home">
          <IconButton onClick={handleGoHome} size="small" sx={{ ml: 0.5 }}>
            <HomeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Search in page">
          <IconButton 
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch && searchInputRef.current) {
                setTimeout(() => searchInputRef.current?.focus(), 0);
              } else {
                setSearchText('');
                findInPage('');
              }
            }}
            size="small"
            color={showSearch ? 'primary' : 'default'}
            sx={{ ml: 0.5 }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search Bar */}
      {showSearch && (
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '4px 8px',
            backgroundColor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <TextField
            inputRef={searchInputRef}
            fullWidth
            variant="standard"
            placeholder="Search in page..."
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            InputProps={{
              disableUnderline: true,
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSearchText('');
                      findInPage('');
                      searchInputRef.current?.focus();
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '4px 0',
              },
            }}
          />
        </Box>
      )}

      {/* WebView */}
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
        <webview
          ref={webviewRef}
          src={currentUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  );
};

export default TabContent;
