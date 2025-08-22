import { createAsyncThunk } from '@reduxjs/toolkit';
import { subjectService } from '../../api/configs';
import {CreateSubjectReqDto, UpdateSubjectReqDto} from "../../api/reponse-dto/subjects.res.dto.ts";

export const fetchAssignedSubjects = createAsyncThunk(
    'subjects/fetchAssigned',
    async () => {
        const response = await subjectService.getAssignedSubjects();
        return response;
    }
);

export const fetchAllSubjects = createAsyncThunk(
    'subjects/fetchAll',
    async () => {
        const response = await subjectService.getAllSubjects();
        return response;
    }
);

export const fetchSubjectById = createAsyncThunk(
    'subjects/fetchById',
    async (subjectId: string) => {
        const response = await subjectService.getSubjectById(subjectId);
        return response;
    }
);

export const createSubject = createAsyncThunk(
    'subjects/create',
    async (subjectData: CreateSubjectReqDto) => {
        const response = await subjectService.createSubject(subjectData);
        return response;
    }
);

export const updateSubject = createAsyncThunk(
    'subjects/update',
    async ({ id, subjectData }: { id: string; subjectData: UpdateSubjectReqDto }) => {
        const response = await subjectService.updateSubject(id, subjectData);
        return response;
    }
);

export const deleteSubject = createAsyncThunk(
    'subjects/delete',
    async (subjectId: string) => {
        await subjectService.deleteSubject(subjectId);
        return subjectId;
    }
);
