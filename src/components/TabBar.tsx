import React, { useRef, useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  Typography,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  ContentCopy as DuplicateIcon,
  Close as CloseIconSmall,
  Close as CloseOthersIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useTabs } from '../contexts/TabsContext';
import ThemeToggle from './ThemeToggle';

const TabBar: React.FC = () => {
  const {
    tabs,
    activeTabId,
    addTab,
    closeTab,
    setActiveTab,
    closeOtherTabs,
    duplicateTab,
    closeAllTabs
  } = useTabs();

  const tabListRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    tabId?: string;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, tabId: string) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4, tabId }
        : null,
    );
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

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'saturate(180%) blur(8px)',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.7)'
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: '44px !important', padding: '0 8px' }}>
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
                height: '2px',
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={renderTabLabel(tab)}
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                sx={{
                  minHeight: 'auto',
                  minWidth: 'auto',
                  px: 1.5,
                  py: 0.75,
                  textTransform: 'none',
                  mr: 0.5,
                  borderRadius: 1.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    color: 'primary.main',
                    backgroundColor: 'action.selected',
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          <Tooltip title="New Tab">
            <IconButton onClick={handleAddTab} size="small" sx={{ ml: 1 }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
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
              closeTab(contextMenu.tabId!);
              handleCloseMenu();
            }}>
              <ListItemIcon>
                <CloseIconSmall fontSize="small" />
              </ListItemIcon>
              <ListItemText>Close</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              closeOtherTabs(contextMenu.tabId!);
              handleCloseMenu();
            }}>
              <ListItemIcon>
                <CloseOthersIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Close Other Tabs</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              duplicateTab(contextMenu.tabId!);
              handleCloseMenu();
            }}>
              <ListItemIcon>
                <DuplicateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Duplicate Tab</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              closeAllTabs();
              handleCloseMenu();
            }}>
              <ListItemIcon>
                <CloseIconSmall fontSize="small" />
              </ListItemIcon>
              <ListItemText>Close All Tabs</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default TabBar;
