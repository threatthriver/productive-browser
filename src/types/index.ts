export interface HistoryEntry {
    url: string;
    title: string;
    timestamp: number;
}

export type TabGroup = {
    id: string;
    name: string;
    color: string;
    collapsed: boolean;
};

export type Tab = {
    id: string;
    title: string;
    url: string;
    favicon?: string;
    loading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
    groupId?: string;
};
