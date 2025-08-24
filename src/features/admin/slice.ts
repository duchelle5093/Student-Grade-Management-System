import { createSlice } from '@reduxjs/toolkit';
import { StudentDataResDto } from '../../api/reponse-dto/student.res.dto';
import { TeacherResDto, AdminStatsResDto, DepartmentResDto } from '../../api/reponse-dto/admin.res.dto';
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

interface AdminState {
    students: StudentDataResDto[];
    teachers: TeacherResDto[];
    departments: DepartmentResDto[];
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
            });
    },
});

export const { clearError, clearImportResult } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;