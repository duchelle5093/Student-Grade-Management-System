import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../api/configs';

export interface DepartmentData {
    name: string;
    subjectIds?: number[];
}

export const createDepartment = createAsyncThunk(
    'departments/create',
    async (departmentData: DepartmentData, { rejectWithValue }) => {
        try {
            return await adminService.createDepartment(departmentData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/update',
    async ({ id, departmentData }: { id: number; departmentData: DepartmentData }, { rejectWithValue }) => {
        try {
            return await adminService.updateDepartment(id, departmentData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification');
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await adminService.deleteDepartment(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    }
);

export const getDepartmentDetails = createAsyncThunk(
    'departments/getDetails',
    async (id: number, { rejectWithValue }) => {
        try {
            return await adminService.getDepartmentDetails(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
        }
    }
);

export const switchUserDepartment = createAsyncThunk(
    'departments/switchUser',
    async (deptId: number, { rejectWithValue }) => {
        try {
            return await adminService.switchUserDepartment(deptId);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors du changement');
        }
    }
);