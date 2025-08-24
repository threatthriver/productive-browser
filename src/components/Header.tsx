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
  useMediaQuery,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography
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
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ContentCopy as DuplicateIcon,
  Close as CloseIconSmall,
  Close as CloseOthersIcon,
  Public as PublicIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTabs } from '../contexts/TabsContext';
import ThemeToggle from './ThemeToggle';
import { TabContentHandle } from './TabContent';
import { Divider, List } from '@mui/material';


interface HeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onThemeChange: () => void;
  tabContentRef: React.RefObject<TabContentHandle>;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, darkMode, onThemeChange, tabContentRef }) => {
    // From TabBar
    const {
        tabs,
        groups,
        activeTabId,
        addTab,
        closeTab,
        setActiveTab,
        closeOtherTabs,
        duplicateTab,
        closeAllTabs,
        toggleGroupCollapsed,
        createGroup,
        addTabToGroup,
        removeTabFromGroup,
        closeTabsInGroup,
      } = useTabs();

      const tabListRef = useRef<HTMLDivElement>(null);
      const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        tabId?: string;
      } | null>(null);

      const [groupContextMenu, setGroupContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        groupId?: string;
      } | null>(null);

      const handleContextMenu = (event: React.MouseEvent, tabId: string) => {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, tabId }
            : null,
        );
      };

      const handleGroupContextMenu = (event: React.MouseEvent, groupId: string) => {
        event.preventDefault();
        setGroupContextMenu(
          groupContextMenu === null
            ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, groupId }
            : null,
        );
      };

      const handleCloseGroupMenu = () => {
        setGroupContextMenu(null);
      };

      const handleCloseMenu = () => {
        setContextMenu(null);
      };

      const handleAddTab = () => {
        addTab('https://www.google.com');
      };

      const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
      };

      const renderTabLabel = (tab: { id: string; title?: string; url: string; favicon?: string }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            {tab.favicon ? (
              <Box component="img" src={tab.favicon} alt="favicon" sx={{ width: 14, height: 14, borderRadius: 0.5 }} />
            ) : (
              <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
          </Box>
          <Typography noWrap sx={{ maxWidth: 180 }}>
            {tab.title || 'New Tab'}
          </Typography>
          <IconButton
            size="small"
            aria-label="Close tab"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            sx={{
              ml: 0.75,
              p: 0.25,
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: '50%',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      );


    // From TopBar
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tabContentRef.current) {
          tabContentRef.current.navigateTo(url);
        }
    };

      const handleRefresh = () => {
        if (tabContentRef.current) {
          tabContentRef.current.reload();
        }
      };

      const handleBack = () => {
        if (tabContentRef.current) {
          tabContentRef.current.goBack();
        }
      };

      const handleForward = () => {
        if (tabContentRef.current) {
          tabContentRef.current.goForward();
        }
      };

      const handleHome = () => {
        if (tabContentRef.current) {
          tabContentRef.current.navigateTo('https://www.google.com');
        }
      };

      useEffect(() => {
        const activeTab = tabs.find(t => t.id === activeTabId);
        if (activeTab) {
            setUrl(activeTab.url);
            setCanGoBack(activeTab.canGoBack || false);
            setCanGoForward(activeTab.canGoForward || false);
            setIsLoading(activeTab.loading || false);
        }

      }, [activeTabId, tabs]);

    const tabStyles = {
        minHeight: 'auto',
        minWidth: 'auto',
        px: 1.5,
        py: 0.75,
        textTransform: 'none',
        mr: 0.5,
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'action.hover',
        },
        '&.Mui-selected': {
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderBottomColor: 'background.paper'
        },
    };


  return (
    <AppBar position="static" elevation={0} color="default">
        { /* TabBar part */ }
        <Toolbar variant="dense" sx={{ minHeight: '44px !important', padding: '0 8px', borderBottom: 1, borderColor: 'divider', alignItems: 'flex-end' }}>
            <Box
            ref={tabListRef}
            sx={{
                display: 'flex',
                flexGrow: 1,
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                height: '4px',
                },
                mb: '-1px' // Overlap the border
            }}
            >
            <Tabs
                value={activeTabId || false}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                    minHeight: 'auto',
                    '& .MuiTabs-indicator': {
                        display: 'none', // Hide the default indicator
                    },
                }}
            >
                {/* Render tabs not in a group */}
                {tabs.filter(tab => !tab.groupId).map((tab) => (
                    <Tab key={tab.id} value={tab.id} label={renderTabLabel(tab)} onContextMenu={(e) => handleContextMenu(e, tab.id)} sx={tabStyles} />
                ))}

                {/* Render groups and their tabs */}
                {groups.map((group) => (
                    <React.Fragment key={group.id}>
                        <Box
                            onClick={() => toggleGroupCollapsed(group.id)}
                            onContextMenu={(e) => handleGroupContextMenu(e, group.id)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: '4px 8px',
                                borderRadius: '8px',
                                backgroundColor: group.color,
                                color: theme.palette.getContrastText(group.color),
                                cursor: 'pointer',
                                mr: 1,
                            }}
                        >
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{group.name}</Typography>
                        </Box>
                        {!group.collapsed && tabs.filter(tab => tab.groupId === group.id).map((tab) => (
                            <Tab key={tab.id} value={tab.id} label={renderTabLabel(tab)} onContextMenu={(e) => handleContextMenu(e, tab.id)} sx={{...tabStyles, borderLeft: `2px solid ${group.color}`}} />
                        ))}
                    </React.Fragment>
                ))}
            </Tabs>
            <Tooltip title="New Tab">
                <IconButton onClick={handleAddTab} size="small" sx={{ ml: 1, mb: 0.5 }}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
            </Box>
      </Toolbar>

        { /* TopBar part */ }
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
                {url.startsWith('https://') ?
                  <LockIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} /> :
                  <PublicIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
                }
                  </InputAdornment>
                ),
            sx: {
              backgroundColor: theme.palette.background.default,
                  borderRadius: '24px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid',
                  borderColor: 'primary.main',
              },
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

      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.tabId && (
          <>
            <MenuItem onClick={() => {
              const tabId = contextMenu.tabId!;
              const groupName = prompt('Enter group name:', 'New Group');
              if (groupName) {
                const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const newGroupId = createGroup(groupName, randomColor);
                addTabToGroup(tabId, newGroupId);
              }
              handleCloseMenu();
            }}>
              <ListItemText>Add to new group</ListItemText>
            </MenuItem>
            {groups.length > 0 && (
                <MenuItem>
                     <ListItemText>Add to existing group</ListItemText>
                     {/* This should be a submenu, but for simplicity we'll just list them */}
                     <List>
                        {groups.map(group => (
                            <ListItem key={group.id} onClick={() => {
                                addTabToGroup(contextMenu.tabId!, group.id);
                                handleCloseMenu();
                            }}>
                                <ListItemText primary={group.name} />
                            </ListItem>
                        ))}
                     </List>
                </MenuItem>
            )}
            {tabs.find(t => t.id === contextMenu.tabId)?.groupId && (
                <MenuItem onClick={() => {
                    removeTabFromGroup(contextMenu.tabId!);
                    handleCloseMenu();
                }}>
                    <ListItemText>Remove from group</ListItemText>
                </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => { closeTab(contextMenu.tabId!); handleCloseMenu(); }}>
              <ListItemIcon> <CloseIconSmall fontSize="small" /> </ListItemIcon>
              <ListItemText>Close</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { closeOtherTabs(contextMenu.tabId!); handleCloseMenu(); }}>
              <ListItemIcon> <CloseOthersIcon fontSize="small" /> </ListItemIcon>
              <ListItemText>Close Other Tabs</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { duplicateTab(contextMenu.tabId!); handleCloseMenu(); }}>
              <ListItemIcon> <DuplicateIcon fontSize="small" /> </ListItemIcon>
              <ListItemText>Duplicate Tab</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { closeAllTabs(); handleCloseMenu(); }}>
              <ListItemIcon> <CloseIconSmall fontSize="small" /> </ListItemIcon>
              <ListItemText>Close All Tabs</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      <Menu
        open={groupContextMenu !== null}
        onClose={handleCloseGroupMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          groupContextMenu !== null
            ? { top: groupContextMenu.mouseY, left: groupContextMenu.mouseX }
            : undefined
        }
      >
        {groupContextMenu?.groupId && (
          <>
            <MenuItem onClick={() => {
                const newName = prompt('Enter new group name:');
                if (newName) {
                    updateGroup(groupContextMenu.groupId!, { name: newName });
                }
                handleCloseGroupMenu();
            }}>
                <ListItemText>Rename</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                const colors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                updateGroup(groupContextMenu.groupId!, { color: randomColor });
                handleCloseGroupMenu();
            }}>
                <ListItemText>Change color</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                deleteGroup(groupContextMenu.groupId!);
                handleCloseGroupMenu();
            }}>
                <ListItemText>Ungroup</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                closeTabsInGroup(groupContextMenu.groupId!);
                handleCloseGroupMenu();
            }}>
                <ListItemText>Close group</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
