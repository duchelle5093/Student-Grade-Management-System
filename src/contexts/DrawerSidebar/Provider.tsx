import { DrawerSidebarContext } from './context';
import { ReactNode, useState } from 'react';

type DrawerSidebarProviderProps = {
    children: ReactNode,
}

export const DrawerSidebarProvider=({children}:DrawerSidebarProviderProps)=>{
    const [isOpen, setIsOpen]=useState(true)

    const toggleSidebar=()=> setIsOpen(!isOpen)
    return (
        <DrawerSidebarContext.Provider value={{isSidebarOpen:isOpen, toggleSidebar:toggleSidebar}}>
            {children}
        </DrawerSidebarContext.Provider>
    )
}
