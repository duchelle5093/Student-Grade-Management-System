import { createContext, useContext } from 'react';

export type NotificationType = {
    type?: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description: string;
    pauseOnHover?: boolean;
};

interface NotificationContextType {
    notify: ({ type, message, description }: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    notify: () => {},
});

export const useNotification = () => {
    const context = useContext(NotificationContext);
    return context;
};
