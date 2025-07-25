import { createContext } from 'react';

type DrawerSidebarContextType = {
    isSidebarOpen: boolean
    toggleSidebar: () => void
};

export const DrawerSidebarContext = createContext<Partial<DrawerSidebarContextType>>({});
