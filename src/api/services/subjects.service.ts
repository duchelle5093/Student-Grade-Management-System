import { AxiosInstance } from 'axios';
import { SubjectResDto, CreateSubjectReqDto, UpdateSubjectReqDto } from '../reponse-dto/subjects.res.dto';

const subjectsApis = {
    GET_ALL_SUBJECTS: 'subjects',
    CREATE_SUBJECT: 'subjects',
    UPDATE_SUBJECT: 'subjects',
    DELETE_SUBJECT: 'subjects',
};

export class SubjectsService {
    protected readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async getAllSubjects(): Promise<SubjectResDto[]> {
        const response = await this._client.get<SubjectResDto[]>(subjectsApis.GET_ALL_SUBJECTS);
        return response.data;
    }

    async createSubject(subject: CreateSubjectReqDto): Promise<SubjectResDto> {
        const response = await this._client.post<SubjectResDto>(subjectsApis.CREATE_SUBJECT, subject);
        return response.data;
    }

    async updateSubject(id: number, subject: UpdateSubjectReqDto): Promise<SubjectResDto> {
        const response = await this._client.put<SubjectResDto>(`${subjectsApis.UPDATE_SUBJECT}/${id}`, subject);
        return response.data;
    }

    async deleteSubject(id: number): Promise<void> {
        await this._client.delete(`${subjectsApis.DELETE_SUBJECT}/${id}`);
    }

    // Assigner un enseignant à une matière
    async assignTeacherToSubject(subjectId: number, teacherId: number, subjectData: SubjectResDto): Promise<SubjectResDto> {
        const updatedSubject = {
            ...subjectData,
            teacherId: teacherId
        };
        return await this.updateSubject(subjectId, updatedSubject);
    }
}