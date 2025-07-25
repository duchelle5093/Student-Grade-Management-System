import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NotificationType} from "./context.ts";

export enum ServerNotificationSource {
    CLIENT = 'CLIENT',
    SERVER = 'SERVER',
}
interface NotificationSliceState {
    notification: NotificationType | null;
    source: ServerNotificationSource;
}

const initialState: NotificationSliceState = {
    notification: null,
    source: ServerNotificationSource.CLIENT,
};

export const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        triggerServerNotification(state, action: PayloadAction<NotificationType | null>) {
            state.notification = action.payload;
            state.source = ServerNotificationSource.SERVER;
        },
        triggerClientNotification(state, action: PayloadAction<NotificationType | null>) {
            state.notification = action.payload;
            state.source = ServerNotificationSource.CLIENT;
        },
    },
});

export const notificationReducer = slice.reducer;
export const {
    triggerServerNotification,
    triggerClientNotification,
} = slice.actions;