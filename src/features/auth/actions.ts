import { createAsyncThunk } from '@reduxjs/toolkit';
import { markAsAuthenticated, markAsUnauthenticated } from './slice';
import { navigateTo } from '../navigation';
import {LoginreqDto} from "../../api/request-dto/auth.req.ts";
import {clearTokens, setTokens} from "../../api/services/token.service.ts";
import {authService} from "../../api/configs";
import {handleAsyncThunk} from "../../utils";
import {triggerClientNotification} from "../../contexts";
import {ChangePasswordReqDto} from "../../api/reponse-dto/auth.res.dto.ts";
import {Role} from "../../api/enums";

export const processLogin = createAsyncThunk(
    'auth/processLogin',
    async (
        { req, navigate }: { req: LoginreqDto; navigate: (path: string) => void },
        { dispatch, rejectWithValue }
    ) => {
        return handleAsyncThunk(async () => {
            clearTokens();
            const res = await authService.login(req);
            setTokens({ token: res.token });
            if (res.mustChangePassword) {
                navigate('/auth/change-password');
            } else if (res.role === Role.STUDENT) {
                navigate('/dashboard/student');
                dispatch(triggerClientNotification({
                    type: 'success',
                    message: "Success",
                    description: 'Connexion reussie!'
                }));
            }else {
                const redirectPath = res.role === Role.TEACHER ? '/dashboard/teacher-overview' : '/dashboard';
                navigate(redirectPath);
                dispatch(triggerClientNotification({
                    type: 'success',
                    message: "Success",
                    description: 'Connexion reussie!'
                }));
            }
            dispatch(markAsAuthenticated());
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

export  const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (
        { req, navigate }: { req:Partial<ChangePasswordReqDto>; navigate: (path: string) => void },
        { rejectWithValue }
    ) => {
        return handleAsyncThunk(async () => {
            const res = await authService.changePassword(req);
            navigate('/auth/login');
            return res;
        }, rejectWithValue);
    }
);

