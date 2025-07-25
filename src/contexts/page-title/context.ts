import { createContext } from 'react';

type PageTitleContextType = {
    pageTitle: string
    setPageTitle: (value: string) => void
};

export const PageTitleContext = createContext<Partial<PageTitleContextType>>({});
