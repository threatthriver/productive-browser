import Store from 'electron-store';

export interface HistoryEntry {
  url: string;
  title: string;
  timestamp: number;
}

const store = new Store<{ history: HistoryEntry[] }>({
  defaults: {
    history: [],
  },
});

export const addHistory = (entry: Omit<HistoryEntry, 'timestamp'>) => {
  const newEntry: HistoryEntry = {
    ...entry,
    timestamp: Date.now(),
  };

  const history = store.get('history', []);
  // Avoid adding duplicate consecutive entries
  if (history.length > 0 && history[0].url === newEntry.url) {
    return;
  }

  store.set('history', [newEntry, ...history]);
};

export const getHistory = (): HistoryEntry[] => {
  return store.get('history', []);
};

export const clearHistory = () => {
  store.set('history', []);
};
