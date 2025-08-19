import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  IconButton,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  Bookmark as BookmarkIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  dateAdded: string;
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://www.google.com', dateAdded: '2025-08-01' },
    { id: '2', title: 'GitHub', url: 'https://www.github.com', dateAdded: '2025-08-05' },
    { id: '3', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', dateAdded: '2025-08-10' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '' });

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookmark.title || !newBookmark.url) return;
    
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      title: newBookmark.title,
      url: newBookmark.url.startsWith('http') ? newBookmark.url : `https://${newBookmark.url}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setBookmarks([...bookmarks, bookmark]);
    setNewBookmark({ title: '', url: '' });
  };

  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Bookmarks
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Bookmark
        </Typography>
        <Box component="form" onSubmit={handleAddBookmark} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Title"
            variant="outlined"
            size="small"
            value={newBookmark.title}
            onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
            required
          />
          <TextField
            label="URL"
            variant="outlined"
            size="small"
            value={newBookmark.url}
            onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
            placeholder="https://example.com"
            required
            sx={{ flexGrow: 1 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Add
          </Button>
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <List>
          {filteredBookmarks.length > 0 ? (
            filteredBookmarks.map((bookmark) => (
              <React.Fragment key={bookmark.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="open"
                        onClick={() => openBookmark(bookmark.url)}
                        sx={{ mr: 1 }}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <BookmarkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={bookmark.title} 
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {bookmark.url}
                        </Typography>
                        <span>Added on {bookmark.dateAdded}</span>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              {searchQuery ? 'No bookmarks found' : 'No bookmarks yet. Add some!'}
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Bookmarks;
