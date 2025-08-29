import { createSlice } from '@reduxjs/toolkit';
import { TeacherGradeResDto} from '../../api/reponse-dto/grade.res.dto';
import {
    fetchTeacherGrades,
    fetchStudentGrades,
    updateGrade,
    deleteGrade,
    fetchGradeSheet,
    exportGrades,
    publishGrades,
    fetchActivePeriod,
    submitGradeClaim,
    processGradeClaim,
    listGradeClaims
} from './actions';
import { StudentGradeResDto} from "../../api/reponse-dto/student.res.dto.ts";
import { GradeClaimResDto } from "../../api/reponse-dto/gradeClaim.res.dto.ts";

interface GradesState {
    teacherGrades: TeacherGradeResDto[];
    studentGrades: StudentGradeResDto[];
    gradeSheet: any;
    activePeriod: any;
    claims: GradeClaimResDto[];
    loading: boolean;
    error: string | null;
    exportLoading: boolean;
    publishLoading: boolean;
    claimsLoading: boolean;
}

const initialState: GradesState = {
    teacherGrades: [],
    studentGrades: [],
    gradeSheet: null,
    activePeriod: null,
    claims: [],
    loading: false,
    error: null,
    exportLoading: false,
    publishLoading: false,
    claimsLoading: false,
};

const gradesSlice = createSlice({
    name: 'grades',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearStudentGrades: (state) => {
            state.studentGrades = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherGrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherGrades.fulfilled, (state, action) => {
                state.loading = false;
                state.teacherGrades = action.payload;
            })
            .addCase(fetchTeacherGrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch teacher grades';
            })
            .addCase(fetchStudentGrades.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentGrades.fulfilled, (state, action) => {
                state.loading = false;
                state.studentGrades = action.payload;
            })
            .addCase(fetchStudentGrades.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch student grades';
            })
            .addCase(updateGrade.fulfilled, (state, action) => {
                const updatedGrade = action.payload;
                state.teacherGrades = state.teacherGrades.map(grade =>
                    grade.id === updatedGrade.id ? { ...grade, ...updatedGrade } : grade
                );
                state.studentGrades = state.studentGrades.map(grade =>
                    grade.studentId === updatedGrade.id ? { ...grade, ...updatedGrade } : grade
                );
            })
            // Delete grade
            .addCase(deleteGrade.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.teacherGrades = state.teacherGrades.filter(grade => grade.id !== deletedId);
                state.studentGrades = state.studentGrades.filter(grade => grade.id !== deletedId);
            })
            // Fetch grade sheet
            .addCase(fetchGradeSheet.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGradeSheet.fulfilled, (state, action) => {
                state.loading = false;
                state.gradeSheet = action.payload;
            })
            .addCase(fetchGradeSheet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch grade sheet';
            })
            // Export grades
            .addCase(exportGrades.pending, (state) => {
                state.exportLoading = true;
            })
            .addCase(exportGrades.fulfilled, (state) => {
                state.exportLoading = false;
            })
            .addCase(exportGrades.rejected, (state, action) => {
                state.exportLoading = false;
                state.error = action.error.message || 'Failed to export grades';
            })
            // Publish grades
            .addCase(publishGrades.pending, (state) => {
                state.publishLoading = true;
            })
            .addCase(publishGrades.fulfilled, (state) => {
                state.publishLoading = false;
            })
            .addCase(publishGrades.rejected, (state, action) => {
                state.publishLoading = false;
                state.error = action.error.message || 'Failed to publish grades';
            })
            // Fetch active period
            .addCase(fetchActivePeriod.fulfilled, (state, action) => {
                // L'API retourne un tableau, prendre le premier élément
                state.activePeriod = Array.isArray(action.payload) ? action.payload[0] : action.payload;
            })
            // Claims management
            .addCase(listGradeClaims.pending, (state) => {
                state.claimsLoading = true;
            })
            .addCase(listGradeClaims.fulfilled, (state, action) => {
                state.claimsLoading = false;
                state.claims = action.payload;
            })
            .addCase(listGradeClaims.rejected, (state, action) => {
                state.claimsLoading = false;
                state.error = action.error.message || 'Failed to fetch claims';
            })
            .addCase(submitGradeClaim.fulfilled, (state, action) => {
                // Ajouter la nouvelle réclamation à la liste
                state.claims.push(action.payload);
            })
            .addCase(processGradeClaim.fulfilled, (state, action) => {
                // Mettre à jour le statut de la réclamation
                const claimIndex = state.claims.findIndex(claim => claim.id === action.meta.arg.claimId);
                if (claimIndex !== -1) {
                    const newStatus = action.meta.arg.decision.approve ? 'APPROVED' : 'REJECTED';
                    state.claims[claimIndex].status = newStatus;
                    if (action.meta.arg.decision.comment) {
                        state.claims[claimIndex].teacherComment = action.meta.arg.decision.comment;
                    }
                }
            });
    },
});

export const { clearError, clearStudentGrades } = gradesSlice.actions;
export const gradesReducer = gradesSlice.reducer;
