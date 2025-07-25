import {Action, combineReducers, configureStore} from "@reduxjs/toolkit";
import {navigationReducer} from "../features/navigation";
import {authReducer} from "../features/auth/slice.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {notificationReducer} from "../contexts";
import { userReducer } from "../features/user/slices.ts";



const combinedReducer = combineReducers({
    navigation : navigationReducer,
    auth: authReducer,
    notification: notificationReducer,
    user : userReducer

})

const rootReducer = (state, action: Action) => {
    if (action.type === 'RESET') {
        state = {};
    }
    return combinedReducer(state, action);
};

export const createStore = () =>(
    configureStore({
        reducer: rootReducer,
    })
)



export const store = createStore();



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
