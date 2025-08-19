import { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  ListItem,
  List,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Button,
  SelectChangeEvent
} from '@mui/material';
const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [searchEngine, setSearchEngine] = useState('google');
  const [homePage, setHomePage] = useState('https://www.google.com');
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);

  const handleSearchEngineChange = (event: SelectChangeEvent) => {
    setSearchEngine(event.target.value as string);
  };

  const handleHomePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHomePage(event.target.value);
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to a database or local storage
    console.log('Settings saved:', {
      darkMode,
      searchEngine,
      homePage,
      notifications,
      locationAccess
    });
    alert('Settings saved successfully!');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  name="darkMode"
                  color="primary"
                />
              }
              label="Dark Mode"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="search-engine-label">Search Engine</InputLabel>
              <Select
                labelId="search-engine-label"
                value={searchEngine}
                label="Search Engine"
                onChange={handleSearchEngineChange}
              >
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="bing">Bing</MenuItem>
                <MenuItem value="duckduckgo">DuckDuckGo</MenuItem>
                <MenuItem value="yahoo">Yahoo</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <Divider />
          <ListItem>
            <TextField
              fullWidth
              label="Home Page"
              value={homePage}
              onChange={handleHomePageChange}
              variant="outlined"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Privacy & Security
        </Typography>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  name="notifications"
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={locationAccess}
                  onChange={(e) => setLocationAccess(e.target.checked)}
                  name="locationAccess"
                  color="primary"
                />
              }
              label="Allow Location Access"
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSaveSettings}
          size="large"
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
