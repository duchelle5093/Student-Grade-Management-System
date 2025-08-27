import { createSlice } from '@reduxjs/toolkit';
import { StudentDataResDto } from '../../api/reponse-dto/student.res.dto';
import { TeacherResDto, AdminStatsResDto, DepartmentResDto } from '../../api/reponse-dto/admin.res.dto';
import { GradingWindowResponse } from '../../api/services/grading-windows.service';
import { 
    fetchAllStudents, 
    fetchAllTeachers,
    fetchAllDepartments,
    createUser, 
    updateUser,
    deleteUser,
    createTeacher,
    importStudents,
    importTeachers
} from './actions';
import { fetchAllSubjects } from '../subjects/actions';
import {
    fetchAllGradingWindows,
    createGradingWindow,
    updateGradingWindow,
    deleteGradingWindow
} from './grading-windows-actions';
import {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentDetails,
    switchUserDepartment
} from './departments-actions';

interface AdminState {
    students: StudentDataResDto[];
    teachers: TeacherResDto[];
    departments: DepartmentResDto[];
    gradingWindows: GradingWindowResponse[];
    stats: AdminStatsResDto | null;
    loading: boolean;
    error: string | null;
    importLoading: boolean;
    importResult: any | null;
}

const initialState: AdminState = {
    students: [],
    teachers: [],
    departments: [],
    gradingWindows: [],
    stats: null,
    loading: false,
    error: null,
    importLoading: false,
    importResult: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearImportResult: (state) => {
            state.importResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch students
            .addCase(fetchAllStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch students';
            })
            
            // Fetch teachers
            .addCase(fetchAllTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(fetchAllTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch teachers';
            })
            
            // Fetch departments
            .addCase(fetchAllDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchAllDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch departments';
            })
            
            // Create user
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create user';
            })
            
            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Mettre à jour l'utilisateur dans la liste
                const index = state.students.findIndex(student => student.id === action.payload.id);
                if (index !== -1) {
                    state.students[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update user';
            })
            
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                // Supprimer l'utilisateur de la liste
                state.students = state.students.filter(student => 
                    (student.studentId || student.id) !== action.payload
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete user';
            })
            
            // Create teacher
            .addCase(createTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeacher.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create teacher';
            })
            

            
            // Import students
            .addCase(importStudents.pending, (state) => {
                state.importLoading = true;
                state.error = null;
            })
            .addCase(importStudents.fulfilled, (state, action) => {
                state.importLoading = false;
                state.importResult = action.payload;
            })
            .addCase(importStudents.rejected, (state, action) => {
                state.importLoading = false;
                state.error = action.error.message || 'Failed to import students';
            })
            
            // Import teachers
            .addCase(importTeachers.pending, (state) => {
                state.importLoading = true;
                state.error = null;
            })
            .addCase(importTeachers.fulfilled, (state, action) => {
                state.importLoading = false;
                state.importResult = action.payload;
            })
            .addCase(importTeachers.rejected, (state, action) => {
                state.importLoading = false;
                state.error = action.error.message || 'Failed to import teachers';
            })
            
            // Fetch grading windows
            .addCase(fetchAllGradingWindows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGradingWindows.fulfilled, (state, action) => {
                state.loading = false;
                state.gradingWindows = action.payload;
            })
            .addCase(fetchAllGradingWindows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch grading windows';
            })
            
            // Create grading window
            .addCase(createGradingWindow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGradingWindow.fulfilled, (state, action) => {
                state.loading = false;
                state.gradingWindows.push(action.payload);
            })
            .addCase(createGradingWindow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to create grading window';
            })
            
            // Update grading window
            .addCase(updateGradingWindow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGradingWindow.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.gradingWindows.findIndex(window => window.id === action.payload.id);
                if (index !== -1) {
                    state.gradingWindows[index] = action.payload;
                }
            })
            .addCase(updateGradingWindow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update grading window';
            })
            
            // Delete grading window
            .addCase(deleteGradingWindow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGradingWindow.fulfilled, (state, action) => {
                state.loading = false;
                state.gradingWindows = state.gradingWindows.filter(window => window.id !== action.payload);
            })
            .addCase(deleteGradingWindow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete grading window';
            })
            
            // Create department
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to create department';
            })
            
            // Update department
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.departments.findIndex(dept => dept.id === action.payload.id);
                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to update department';
            })
            
            // Delete department
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = state.departments.filter(dept => dept.id !== action.payload);
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to delete department';
            })
            
            // Get department details
            .addCase(getDepartmentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDepartmentDetails.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getDepartmentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to get department details';
            })
            
            // Switch user department
            .addCase(switchUserDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(switchUserDepartment.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(switchUserDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to switch department';
            });
    },
});

export const { clearError, clearImportResult } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;