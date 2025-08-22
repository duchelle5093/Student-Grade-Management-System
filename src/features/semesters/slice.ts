import { createSlice } from '@reduxjs/toolkit';
import { SemesterResDto } from '../../api/reponse-dto/semester.res.dto';
import { fetchSemesters, fetchActiveSemester } from './actions';

interface SemestersState {
    semesters: SemesterResDto[];
    activeSemester: SemesterResDto | null;
    loading: boolean;
    error: string | null;
}

const initialState: SemestersState = {
    semesters: [],
    activeSemester: null,
    loading: false,
    error: null,
};

const semestersSlice = createSlice({
    name: 'semesters',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSemesters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSemesters.fulfilled, (state, action) => {
                state.loading = false;
                state.semesters = action.payload;
            })
            .addCase(fetchSemesters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch semesters';
            })
            .addCase(fetchActiveSemester.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveSemester.fulfilled, (state, action) => {
                state.loading = false;
                state.activeSemester = action.payload;
            })
            .addCase(fetchActiveSemester.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch active semester';
            });
    },
});

export const { clearError } = semestersSlice.actions;
export const semestersReducer = semestersSlice.reducer;
