import React, { useCallback, useMemo } from 'react';
import { notification } from 'antd';
import { NotificationContext, NotificationType } from './context';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                  children,
                                                                              }) => {
    const [api, contextHolder] = notification.useNotification();

    const notify = useCallback(
        ({
             type = 'success',
             message,
             description,
             pauseOnHover = true,
         }: NotificationType) => {
            api.open({
                message,
                description,
                showProgress: true,
                pauseOnHover,
                type,
            });
        },
        [api]
    );

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <NotificationContext.Provider value={value}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};
