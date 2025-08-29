import { AxiosInstance } from 'axios';
import {
    GradeResDto,
    CreateGradeReqDto,
    CreateGradeByCodeReqDto,
    UpdateGradeReqDto,
    TeacherGradeResDto
} from '../reponse-dto/grade.res.dto';
import {StudentDataResDto } from "../reponse-dto/student.res.dto.ts";
import {GradeClaimReqDto} from "../request-dto/gradeClaim.req.dto.ts";
import { GradingWindowResponse } from './grading-windows.service';

const gradeApis = {
    CREATE: 'grades',
    CREATE_BY_CODE: 'grades/by-code',
    UPDATE: 'grades',
    DELETE: 'grades',
    GET_TEACHER_GRADES: 'grades/teacher/my-grades',
    GET_STUDENT_GRADES: 'grades/student',
    GET_GRADE_SHEET: 'grades/sheet',
    GET_GRADE_SHEET_SELF: 'grades/sheet/self',
    EXPORT_PUBLISH: 'export/publish',
    EXPORT_PRINT: 'export/print',
    APPROVE_GRADE_CLAIM: 'grade-claims',
    REJECT_GRADE_CLAIM: 'grade-claims',
    SUBMIT_GRADE_CLAIM: 'grade-claims',
    LIST_GRADE_CLAIMS: 'grade-claims',
    GET_ACTIVE_PERIOD: 'grading-windows/active',
};

export class GradeService {
    protected readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async createGrade(req: CreateGradeReqDto): Promise<GradeResDto> {
        const response = await this._client.post<GradeResDto>(gradeApis.CREATE, req);
        return response.data;
    }

    async createGradeByCode(req: CreateGradeByCodeReqDto): Promise<GradeResDto> {
        const response = await this._client.post<GradeResDto>(gradeApis.CREATE_BY_CODE, req);
        return response.data;
    }

    async updateGrade(gradeId: number, req: UpdateGradeReqDto): Promise<GradeResDto> {
        const response = await this._client.put<GradeResDto>(`${gradeApis.UPDATE}/${gradeId}`, req);
        return response.data;
    }

    async deleteGrade(gradeId: number): Promise<void> {
        await this._client.delete(`${gradeApis.DELETE}/${gradeId}`);
    }

    async getTeacherGrades(): Promise<TeacherGradeResDto[]> {
        const response = await this._client.get<TeacherGradeResDto[]>(gradeApis.GET_TEACHER_GRADES);
        return response.data;
    }

    async getStudentGrades(studentId: number): Promise<StudentDataResDto> {
        const response = await this._client.get<StudentDataResDto>(`${gradeApis.GET_STUDENT_GRADES}/${studentId}`);
        return response.data;
    }

    async getGradeSheet(): Promise<any> {
        const response = await this._client.get(gradeApis.GET_GRADE_SHEET);
        return response.data;
    }

    async getGradeSheetSelf(): Promise<any> {
        const response = await this._client.get(gradeApis.GET_GRADE_SHEET_SELF);
        return response.data;
    }

    async exportPublish(data: any): Promise<any> {
        const response = await this._client.post(gradeApis.EXPORT_PUBLISH, data);
        return response.data;
    }

    async exportPrint(data: any): Promise<any> {
        const response = await this._client.post(gradeApis.EXPORT_PRINT, data);
        return response.data;
    }

    async processGradeClaim(gradeClaimId: number, decision: { approve: boolean; comment?: string }): Promise<any> {
        const response = await this._client.put(`${gradeApis.APPROVE_GRADE_CLAIM}/${gradeClaimId}`, decision);
        return response.data;
    }

    async submitGradeClaim(req: GradeClaimReqDto): Promise<any> {
        const response = await this._client.post(`${gradeApis.SUBMIT_GRADE_CLAIM}` , req);
        return response.data;
    }

    async listGradeClaims(): Promise<any> {
        const response = await this._client.get(`${gradeApis.LIST_GRADE_CLAIMS}`);
        return response.data;
    }

    async getActivePeriod(): Promise<GradingWindowResponse | null> {
        const response = await this._client.get<GradingWindowResponse | null>(gradeApis.GET_ACTIVE_PERIOD);
        return response.data;
    }
}
