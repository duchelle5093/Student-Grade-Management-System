import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../api/configs';
import { SubjectResDto, CreateSubjectReqDto, UpdateSubjectReqDto } from '../../api/reponse-dto/subjects.res.dto';

// Actions pour les matières
export const fetchAllSubjects = createAsyncThunk(
    'subjects/fetchAllSubjects',
    async (_, { rejectWithValue }) => {
        try {
            return await adminService.getAllSubjects();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des matières');
        }
    }
);

export const createSubject = createAsyncThunk(
    'subjects/createSubject',
    async (subjectData: CreateSubjectReqDto, { rejectWithValue }) => {
        try {
            return await adminService.createSubject(subjectData);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error ||
                                'Erreur lors de la création de la matière';
            console.error('Create subject error:', error.response?.data);
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateSubject = createAsyncThunk(
    'subjects/updateSubject',
    async ({ id, subjectData }: { id: number; subjectData: UpdateSubjectReqDto }, { rejectWithValue }) => {
        try {
            return await adminService.updateSubject(id, subjectData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification');
        }
    }
);

export const deleteSubject = createAsyncThunk(
    'subjects/deleteSubject',
    async (id: number, { rejectWithValue }) => {
        try {
            await adminService.deleteSubject(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
        }
    }
);

export const assignTeacherToSubject = createAsyncThunk(
    'subjects/assignTeacher',
    async ({ subjectId, teacherId, subjectData }: { subjectId: number; teacherId: number; subjectData: SubjectResDto }, { rejectWithValue }) => {
        try {
            const updatedSubject = {
                ...subjectData,
                teacherId: teacherId
            };
            return await adminService.updateSubject(subjectId, updatedSubject);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'assignation');
        }
    }
);