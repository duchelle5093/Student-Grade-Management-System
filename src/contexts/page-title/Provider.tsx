import { ReactNode, useState } from 'react';
import { PageTitleContext } from './context';

type PageTitleProviderProps = {
    children: ReactNode,
}

export const PageTitleProvider=({children}:PageTitleProviderProps)=>{
    const [pageTitle, setPageTitle]=useState("")

    return (
        <PageTitleContext.Provider value={{pageTitle, setPageTitle}}>
            {children}
        </PageTitleContext.Provider>)
}
