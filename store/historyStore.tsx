import { create } from "zustand";

interface HistoryState {
  history: any;
  currentPage: number;
  push: (path: string) => boolean;
  replace: (path: string) => boolean;
  back: () => boolean;
  forward: () => boolean;
}

export const historyStore = create<HistoryState>((set, get) => ({
  history: [globalThis.location?.pathname + globalThis.location?.search],
  currentPage: 0,
  push(path) {
    const { history, currentPage } = get();
    if (path === history[currentPage]) return false;

    const newHistory = history.slice(0, currentPage + 1);
    newHistory.push(path);
    set({ history: newHistory, currentPage: currentPage + 1 });
    return true;
  },
  replace(path) {
    const { history, currentPage } = get();
    const newHistory = history.slice(0, currentPage);
    newHistory.push(path);
    set({ history: newHistory, currentPage: currentPage });
    return true;
  },
  back() {
    const currentPage = get().currentPage;

    if (currentPage === 0 ) return false;

    set({ currentPage: currentPage - 1 });
    return true;
  },
  forward() {
    const {history: {length}, currentPage} = get();

    if (currentPage === length - 1) return false;

    set({ currentPage: currentPage + 1 });
    return true;
  }
}));