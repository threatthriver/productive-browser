import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Star as StarIcon,
  Folder as FolderIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTabs } from '../contexts/TabsContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addTab } = useTabs();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Bookmarks', icon: <BookmarkIcon />, path: '/bookmarks' },
    { text: 'History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Downloads', icon: <DownloadIcon />, path: '/downloads' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const bookmarks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'GitHub', url: 'https://www.github.com' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleBookmarkClick = (url: string) => {
    // Open bookmark in a new tab and navigate to main browser view
    addTab(url);
    navigate('/');
    if (isMobile) onClose();
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div">
          Menu
        </Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                borderRadius: 1,
              }}
            >
              <ListItemIcon sx={{ color: 'text.primary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <StarIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Quick Links
        </Typography>
        <List dense>
          {bookmarks.map((bookmark, index) => (
            <ListItem disablePadding key={index} sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleBookmarkClick(bookmark.url)}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={bookmark.name} 
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondary={bookmark.url}
                  secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                  sx={{ my: 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
