import { createSlice } from '@reduxjs/toolkit';
import { SemesterResDto } from '../../api/reponse-dto/semester.res.dto';
import { fetchSemesters, fetchActiveSemester, createSemester, updateSemester, updateSemesters, deleteSemester } from './actions';

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
            })
            .addCase(createSemester.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSemester.fulfilled, (state, action) => {
                state.loading = false;
                // Si le nouveau semestre est actif, désactiver les autres
                if (action.payload.active) {
                    state.semesters.forEach(s => s.active = false);
                }
                state.semesters.push(action.payload);
            })
            .addCase(createSemester.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create semester';
            })
            .addCase(updateSemester.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSemester.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.semesters.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    // Si le semestre devient actif, désactiver les autres
                    if (action.payload.active) {
                        state.semesters.forEach(s => s.active = false);
                    }
                    state.semesters[index] = action.payload;
                }
            })
            .addCase(updateSemester.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update semester';
            })
            .addCase(updateSemesters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSemesters.fulfilled, (state, action) => {
                state.loading = false;
                state.semesters = action.payload;
            })
            .addCase(updateSemesters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update semesters';
            })
            .addCase(deleteSemester.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSemester.fulfilled, (state, action) => {
                state.loading = false;
                state.semesters = state.semesters.filter(s => s.id !== action.payload);
            })
            .addCase(deleteSemester.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete semester';
            });
    },
});

export const { clearError } = semestersSlice.actions;
export const semestersReducer = semestersSlice.reducer;
