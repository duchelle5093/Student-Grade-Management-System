import { AxiosError } from 'axios';

export const handleAsyncThunk = async <T>(
    asyncFunction: () => Promise<T>,
    successCallback?: (res: T) => void,
    rejectWithValue?: any
) => {
    try {
        const result = await asyncFunction();
        successCallback?.(result);
        return result;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            return rejectWithValue(e.response?.data || 'An unknown error occurred');
        }
        return rejectWithValue('An unknown error occurred');
    }
};
