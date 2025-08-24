import Store from 'electron-store';
import { HistoryEntry, Tab, TabGroup } from '../types';

interface StoreSchema {
  history: HistoryEntry[];
  tabs: Tab[];
  groups: TabGroup[];
  activeTabId: string | null;
}

const store = new Store<StoreSchema>({
  defaults: {
    history: [],
    tabs: [],
    groups: [],
    activeTabId: null,
  },
});

export default store;
