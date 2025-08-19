import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  // Initialize from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme-mode') as ThemeMode | null;
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    } catch {}
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: mode === 'dark' ? '#f48fb1' : '#9c27b0',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        shape: {
          borderRadius: 10,
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backdropFilter: 'saturate(180%) blur(8px)',
              },
            },
          },
          MuiPaper: {
            defaultProps: {
              elevation: 0,
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              root: {
                minHeight: 40,
              },
              indicator: {
                height: 2,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                minHeight: 40,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Persist theme mode
  useEffect(() => {
    try {
      localStorage.setItem('theme-mode', mode);
    } catch {}
  }, [mode]);

  const value = {
    mode,
    toggleTheme,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
