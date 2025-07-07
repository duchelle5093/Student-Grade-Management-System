import {useEffect } from 'react';
import { TypedUseSelectorHook } from 'react-redux';
import {ServerNotificationSource, useNotification} from "../contexts";

export const useServerNotificationHandler = (
    useSelector: TypedUseSelectorHook<any>
) => {
    const { source, notification } = useSelector((state) => state.notification);
    const { notify } = useNotification();

    useEffect(() => {
        if (notification) {
            notify({
                ...notification,
                message: notification.message,
                description:
                    source === ServerNotificationSource.CLIENT
                        ? notification.description
                        : notification.description,
            });
        }

    }, [
        notification,
        notify,
        source,
    ]);
};
