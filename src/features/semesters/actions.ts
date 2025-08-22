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
