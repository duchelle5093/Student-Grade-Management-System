import { AxiosInstance } from 'axios';
import {CreateSubjectReqDto, SubjectResDto, UpdateSubjectReqDto} from "../reponse-dto/subjects.res.dto.ts";

const subjectApis = {
    GET_ALL: 'subjects',
    GET_BY_ID: 'subjects',
    GET_ASSIGNED: 'subjects/assigned',
    GET_VIEW_ONLY: 'subjects/view-only',
    CREATE: 'subjects',
    UPDATE: 'subjects',
    DELETE: 'subjects',
};

export class SubjectService {
    protected readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async getAllSubjects(): Promise<SubjectResDto[]> {
        const response = await this._client.get<SubjectResDto[]>(subjectApis.GET_ALL);
        return response.data;
    }

    async getSubjectById(id: string): Promise<SubjectResDto> {
        const response = await this._client.get<SubjectResDto>(`${subjectApis.GET_BY_ID}/${id}`);
        return response.data;
    }

    async getAssignedSubjects(): Promise<SubjectResDto[]> {
        const response = await this._client.get<SubjectResDto[]>(subjectApis.GET_ASSIGNED);
        return response.data;
    }

    async getViewOnlySubjects(): Promise<SubjectResDto[]> {
        const response = await this._client.get<SubjectResDto[]>(subjectApis.GET_VIEW_ONLY);
        return response.data;
    }

    async createSubject(req: CreateSubjectReqDto): Promise<SubjectResDto> {
        const response = await this._client.post<SubjectResDto>(subjectApis.CREATE, req);
        return response.data;
    }

    async updateSubject(id: string, req: UpdateSubjectReqDto): Promise<SubjectResDto> {
        const response = await this._client.put<SubjectResDto>(`${subjectApis.UPDATE}/${id}`, req);
        return response.data;
    }

    async deleteSubject(id: string): Promise<void> {
        await this._client.delete(`${subjectApis.DELETE}/${id}`);
    }
}
