import { createAsyncThunk } from '@reduxjs/toolkit';
import { gradingWindowsService } from '../../api/configs';
import { GradingWindowRequest } from '../../api/services/grading-windows.service';

// Actions pour les fenêtres de notation
export const fetchAllGradingWindows = createAsyncThunk(
    'admin/fetchAllGradingWindows',
    async () => {
        return await gradingWindowsService.getAllGradingWindows();
    }
);

export const createGradingWindow = createAsyncThunk(
    'admin/createGradingWindow',
    async (windowData: GradingWindowRequest, { rejectWithValue }) => {
        try {
            return await gradingWindowsService.createGradingWindow(windowData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
        }
    }
);

export const updateGradingWindow = createAsyncThunk(
    'admin/updateGradingWindow',
    async ({ id, windowData }: { id: number; windowData: GradingWindowRequest }, { rejectWithValue }) => {
        try {
            return await gradingWindowsService.updateGradingWindow(id, windowData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification');
        }
    }
);

export const deleteGradingWindow = createAsyncThunk(
    'admin/deleteGradingWindow',
    async (id: number, { rejectWithValue }) => {
        try {
            await gradingWindowsService.deleteGradingWindow(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    }
);

