import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService, adminReportsService } from '../../api/configs';
import { CreateTeacherReqDto } from '../../api/request-dto/admin.req.dto';
import { Role } from '../../api/enums';

// Actions pour les étudiants
export const fetchAllStudents = createAsyncThunk(
    'admin/fetchAllStudents',
    async () => {
        return await adminService.getAllStudents();
    }
);

export const createUser = createAsyncThunk(
    'admin/createUser',
    async (userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        // Champs spécifiques aux étudiants
        level?: string;
        matricule?: string;
        speciality?: string;
        cycle?: string;
        // Champs spécifiques aux enseignants
        levels?: string[];
        department?: string;
        phone?: string;
    }, { rejectWithValue }) => {
        try {
            return await adminService.createUser(userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
        }
    }
);

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ id, userData, role }: { id: number; userData: any; role: Role }, { rejectWithValue }) => {
        try {
            if (role === Role.TEACHER) {
                return await adminService.updateTeacher(id, userData);
            } else {
                return await adminService.updateStudent(id, userData);
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id: number, { rejectWithValue }) => {
        try {
            await adminService.deleteUser(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    }
);

// Actions pour les enseignants
export const fetchAllTeachers = createAsyncThunk(
    'admin/fetchAllTeachers',
    async () => {
        return await adminService.getAllTeachers();
    }
);

export const createTeacher = createAsyncThunk(
    'admin/createTeacher',
    async (teacherData: CreateTeacherReqDto) => {
        return await adminService.createTeacher(teacherData);
    }
);

// Actions pour les départements
export const fetchAllDepartments = createAsyncThunk(
    'admin/fetchAllDepartments',
    async () => {
        return await adminService.getAllDepartments();
    }
);



// Actions pour l'import
export const importStudents = createAsyncThunk(
    'admin/importStudents',
    async (file: File) => {
        return await adminReportsService.importStudents(file);
    }
);

export const importTeachers = createAsyncThunk(
    'admin/importTeachers',
    async (file: File) => {
        return await adminReportsService.importTeachers(file);
    }
);

// Actions pour les fenêtres de notation
export const fetchAllGradingWindows = createAsyncThunk(
    'admin/fetchAllGradingWindows',
    async () => {
        return await adminService.getAllGradingWindows();
    }
);

export const createGradingWindow = createAsyncThunk(
    'admin/createGradingWindow',
    async (windowData: any, { rejectWithValue }) => {
        try {
            return await adminService.createGradingWindow(windowData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
        }
    }
);

export const updateGradingWindow = createAsyncThunk(
    'admin/updateGradingWindow',
    async (windowData: any, { rejectWithValue }) => {
        try {
            return await adminService.updateGradingWindow(windowData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification');
        }
    }
);