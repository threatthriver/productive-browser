import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Paper
} from '@mui/material';
import { getHistory, clearHistory, HistoryEntry } from '../utils/historyManager';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        History
      </Typography>
      <Button
        variant="contained"
        onClick={handleClearHistory}
        sx={{ mb: 2 }}
        disabled={history.length === 0}
      >
        Clear Browsing History
      </Button>
      <Paper>
        <List>
          {history.map((item, index) => (
            <React.Fragment key={item.timestamp}>
              <ListItem button component="a" href={item.url} target="_blank">
                <ListItemText
                  primary={item.title}
                  secondary={`${item.url} - ${new Date(item.timestamp).toLocaleString()}`}
                />
              </ListItem>
              {index < history.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        {history.length === 0 && (
            <Typography sx={{ p: 2, textAlign: 'center' }}>
                No history yet.
            </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default HistoryPage;
