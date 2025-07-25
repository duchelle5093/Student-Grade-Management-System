import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {AuthService} from "../services/auth.service.ts";
import {store} from "../../store";
import {triggerClientNotification, triggerServerNotification} from "../../contexts";
import { UserService } from '../services/user.service.ts';


const apiGatewayClient = axios.create({
    baseURL: 'http://localhost:3030/api',
});

apiGatewayClient.interceptors.request.use((config) => {
    const token =
        sessionStorage.getItem('token') ??
        localStorage.getItem('token');

    const headers = Object.assign(
        config.headers,
        token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : {},
    ) as unknown;

    return {
        ...config,
        headers,
    } as InternalAxiosRequestConfig<any>;
});

apiGatewayClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code && error.code === 'ERR_NETWORK') {
            store.dispatch(
                triggerClientNotification({
                    message: 'error',
                    type: 'error',
                    description: 'Network error',
                })
            );
        } // Send by client
      else if (
            error instanceof AxiosError &&
            error.status &&
            error.status >= 400 &&
            error.status <= 499 &&
            error.response
        ) {
            const message =
                error.response.data.detail ??
                error.response.data.message ??
                error.response.data.error ??
                error.response.data.title ??
                error.response.statusText ??
                error.response.data.cause; // Send by server
            store.dispatch(
                triggerServerNotification({
                    message: 'error',
                    type: 'error',
                    description: message,
                })
            );
        } else {
            store.dispatch(
                triggerClientNotification({
                    message: 'error',
                    type: 'error',
                    description: 'something went wrong',
                })
            ); // Send by client
        } // Send by client

        return Promise.reject(new Error());
    }
);



export const authService = new AuthService(apiGatewayClient);
export const userService = new UserService(apiGatewayClient);
