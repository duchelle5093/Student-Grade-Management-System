import { ReactNode, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from "../store";
import {Spinner} from "./Spinner.tsx";
import { fetchUserProfile } from '../features/user/actions.ts';
import { markAsAuthenticated, markAsUnauthenticated } from '../features/auth/slice.ts';


interface PrivateRoutesProps {
    children: ReactNode;
}

export const PrivateRoutes = ({ children }: PrivateRoutesProps) => {

    const dispatch = useAppDispatch();

    const { isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    const loadUserProfile = async () => {
        const action = await dispatch(fetchUserProfile());
        if (fetchUserProfile.fulfilled.match(action)) {
        dispatch(markAsAuthenticated());
        } else dispatch(markAsUnauthenticated());
    };

    useEffect(() => {
        loadUserProfile();
    }, []);


    if (isAuthenticated == null) {
        return (
            <div className={'flex items-center justify-center w-screen h-screen'}>
                <Spinner/>
            </div>
        )
    }


    return isAuthenticated ? children : <Navigate to={'/auth'} />;
};
