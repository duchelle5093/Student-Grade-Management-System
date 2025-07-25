import { createAsyncThunk } from '@reduxjs/toolkit';
import { markAsAuthenticated, markAsUnauthenticated } from './slice';
import { navigateTo } from '../navigation';
import {LoginreqDto} from "../../api/request-dto/auth.req.ts";
import {clearTokens, setTokens} from "../../api/services/token.service.ts";
import {authService} from "../../api/configs";
import {handleAsyncThunk} from "../../utils/handleAsyncThunk.ts";
import {triggerClientNotification} from "../../contexts";



export const processLogin = createAsyncThunk(
    'auth/processLogin',
    async (
        { req}: { req: LoginreqDto},
        { dispatch, rejectWithValue }
    ) => {
        return handleAsyncThunk(async () => {
            clearTokens();
            const res = await authService.login(req);
            setTokens({
                token: res.token,
            });
            dispatch(markAsAuthenticated());
            dispatch(triggerClientNotification({
               type: 'success',
               message: "Success",
               description:'Connexion reussie!'
            }))
            dispatch(navigateTo('/dashboard'));
            return res;
        }, rejectWithValue);
    }
);

export const processSignOut = createAsyncThunk(
    'auth/processSignOut',
    async (_, { dispatch, rejectWithValue }) => {
        return handleAsyncThunk(async () => {
            clearTokens();
            dispatch(markAsUnauthenticated());
            dispatch({ type: 'RESET' });
            dispatch(navigateTo('/'));
        }, rejectWithValue);
    }
);

