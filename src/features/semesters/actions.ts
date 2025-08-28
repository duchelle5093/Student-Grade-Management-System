import { createAsyncThunk } from '@reduxjs/toolkit';
import { semesterService } from '../../api/configs';
import { SemesterResDto } from '../../api/reponse-dto/semester.res.dto';

export const fetchSemesters = createAsyncThunk<SemesterResDto[]>(
    'semesters/fetchSemesters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await semesterService.getSemesters();
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch semesters') || error;
        }
    }
);

export const fetchActiveSemester = createAsyncThunk<SemesterResDto | null>(
    'semesters/fetchActiveSemester',
    async (_, { rejectWithValue }) => {
        try {
            const response = await semesterService.getActiveSemester();
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch active semester') || error;
        }
    }
);

export const createSemester = createAsyncThunk<SemesterResDto, {
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    orderIndex: number;
}>(
    'semesters/createSemester',
    async (semesterData, { rejectWithValue }) => {
        try {
            const response = await semesterService.createSemester(semesterData);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to create semester') || error;
        }
    }
);

export const updateSemester = createAsyncThunk<SemesterResDto, {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    orderIndex: number;
}>(
    'semesters/updateSemester',
    async (semesterData, { rejectWithValue }) => {
        try {
            const response = await semesterService.updateSemester(semesterData);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to update semester') || error;
        }
    }
);

export const updateSemesters = createAsyncThunk<SemesterResDto[], {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    active: boolean;
    orderIndex: number;
}[]>(
    'semesters/updateSemesters',
    async (semestersData, { rejectWithValue }) => {
        try {
            const response = await semesterService.updateSemesters(semestersData);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to update semesters') || error;
        }
    }
);

export const deleteSemester = createAsyncThunk<number, number>(
    'semesters/deleteSemester',
    async (id, { rejectWithValue }) => {
        try {
            await semesterService.deleteSemester(id);
            return id;
        } catch (error) {
            return rejectWithValue('Failed to delete semester') || error;
        }
    }
);
