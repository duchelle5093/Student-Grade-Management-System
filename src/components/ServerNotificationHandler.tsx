import {useAppSelector} from "../store";
import {useServerNotificationHandler} from "../hooks";

export const ServerNotificationHandler = () => {
    useServerNotificationHandler(useAppSelector);
    return null;
};
