// hooks/useAppNavigation.ts
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { navigateTo as setNavigationPath } from '../features/navigation';

export const useAppNavigation = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const navigateTo = (path: string) => {
        dispatch(setNavigationPath(path));
        navigate(path);
    };

    return { navigateTo };
};