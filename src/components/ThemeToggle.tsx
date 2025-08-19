import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleTheme} color="inherit" size="large">
        {isDarkMode ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
