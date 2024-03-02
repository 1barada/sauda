import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface HistoryState {
  history: string[];
  currentPage: number;
  push: (path: string) => boolean;
  replace: (path: string) => boolean;
  back: () => boolean;
  forward: () => boolean;
}

type HistorySessionStorageType = Pick<HistoryState, 'history' | 'currentPage'>

export const historyStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [globalThis.location?.pathname + globalThis.location?.search],
      currentPage: 0,
      push(path) {
        const { history, currentPage } = get();
        if (path === history[currentPage]) return false;

        const newHistory = [...history.slice(0, currentPage + 1), path];
        set({ history: newHistory, currentPage: currentPage + 1 });
        return true;
      },
      replace(path) {
        const { history, currentPage } = get();
        const newHistory = [...history.slice(0, currentPage), path];
        set({ history: newHistory });
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
    }), {
      name: 'history-storage',
      storage: createJSONStorage<HistorySessionStorageType>(() => sessionStorage, {
        reviver: (key, value) => {
          const { history, currentPage } = value as HistorySessionStorageType;

          if (history && currentPage !== undefined) {
            const currentPagePath: string = location.pathname + location.search;

            // if we on the same page as before just return stored history data
            if (history[currentPage] === currentPagePath) {
              return {
                history,
                currentPage
              }
            }

            // if we on the end of history just add new path in the end
            // else replace with the new path in 'currentPage' index
            if (currentPage === history.length - 1) {
              return {
                history: [...history, currentPagePath],
                currentPage: currentPage + 1
              };
            } else {
              const newHistory = [...history.slice(0, currentPage), currentPagePath, ...history.slice(currentPage + 1, history.length)];

              return {
                history: newHistory,
                currentPage
              }
            }
          }

          return value;
        }
      }),
      partialize: ({history, currentPage}) => ({history, currentPage})
    }
  )
);