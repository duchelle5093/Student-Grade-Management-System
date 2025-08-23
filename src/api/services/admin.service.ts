import { AxiosInstance } from 'axios';
import { StudentDataResDto } from '../reponse-dto/student.res.dto';
import {CreateSubjectReqDto, SubjectResDto} from '../reponse-dto/subjects.res.dto';
import { RegisterReqDto } from '../request-dto/auth.req';
import { 
    CreateTeacherReqDto, 
    CreateDepartmentReqDto, 
    UpdateDepartmentReqDto,
    BulkSemesterUpdateReqDto,
    CreateSemesterReqDto
} from '../request-dto/admin.req.dto';
import { DepartmentResDto } from '../reponse-dto/admin.res.dto';
import { Role } from '../enums';

const adminApis = {
    // Utilisateurs (utilise les endpoints existants)
    REGISTER_USER: 'auth/register',
    GET_STUDENTS: 'students',
    
    // Enseignants
    CREATE_TEACHER: 'admin/sub-teachers',
    
    // Départements
    GET_ALL_DEPARTMENTS: 'departments',
    GET_DEPARTMENT_BY_ID: 'departments',
    CREATE_DEPARTMENT: 'departments',
    UPDATE_DEPARTMENT: 'departments',
    DELETE_DEPARTMENT: 'departments',
    GET_DEPARTMENT_DETAILS: 'departments',
    
    // Semestres
    BULK_UPDATE_SEMESTERS: 'semesters',
    CREATE_SEMESTER: 'semesters',
    DELETE_SEMESTER: 'semesters',
    GET_SEMESTER_WINDOWS: 'semesters',
    
    // Matières
    GET_ALL_SUBJECTS: 'subjects',
    CREATE_SUBJECT: 'subjects',
    DELETE_SUBJECT: 'subjects',
};

export class AdminService {
    protected readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client;
    }

    // Gestion des utilisateurs (utilise les endpoints existants)
    async getAllStudents(): Promise<StudentDataResDto[]> {
        const response = await this._client.get<StudentDataResDto[]>(adminApis.GET_STUDENTS);
        return response.data;
    }

    async createUser(userData: {
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: Role;
        level: string;
        matricule: string;
        speciality: string;
        cycle: string;
        dateOfBirth: string;
        placeOfBirth: string;
    }): Promise<any> {
        const registerData: RegisterReqDto = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            level: userData.level,
            matricule: userData.matricule,
            speciality: userData.speciality,
            cycle: userData.cycle,
            dateOfBirth: userData.dateOfBirth,
            placeOfBirth: userData.placeOfBirth
        };
        const response = await this._client.post(adminApis.REGISTER_USER, registerData);
        return response.data;
    }

    // Gestion des enseignants

    async createTeacher(teacher: CreateTeacherReqDto): Promise<any> {
        const response = await this._client.post(adminApis.CREATE_TEACHER, teacher);
        return response.data;
    }

    // Gestion des matières
    async getAllSubjects(): Promise<SubjectResDto[]> {
        const response = await this._client.get<SubjectResDto[]>(adminApis.GET_ALL_SUBJECTS);
        return response.data;
    }

    async createSubject(subject: CreateSubjectReqDto): Promise<SubjectResDto> {
        const response = await this._client.post<SubjectResDto>(adminApis.CREATE_SUBJECT, subject);
        return response.data;
    }

    async deleteSubject(id: number): Promise<void> {
        await this._client.delete(`${adminApis.DELETE_SUBJECT}/${id}`);
    }

    // Gestion des départements
    async getAllDepartments(): Promise<DepartmentResDto[]> {
        const response = await this._client.get<DepartmentResDto[]>(adminApis.GET_ALL_DEPARTMENTS);
        return response.data;
    }

    async getDepartmentById(id: number): Promise<DepartmentResDto> {
        const response = await this._client.get<DepartmentResDto>(`${adminApis.GET_DEPARTMENT_BY_ID}/${id}`);
        return response.data;
    }

    async createDepartment(department: CreateDepartmentReqDto): Promise<DepartmentResDto> {
        const response = await this._client.post<DepartmentResDto>(adminApis.CREATE_DEPARTMENT, department);
        return response.data;
    }

    async updateDepartment(id: number, department: UpdateDepartmentReqDto): Promise<DepartmentResDto> {
        const response = await this._client.put<DepartmentResDto>(`${adminApis.UPDATE_DEPARTMENT}/${id}`, department);
        return response.data;
    }

    async deleteDepartment(id: number): Promise<void> {
        await this._client.delete(`${adminApis.DELETE_DEPARTMENT}/${id}`);
    }

    async getDepartmentDetails(id: number): Promise<DepartmentResDto> {
        const response = await this._client.get<DepartmentResDto>(`${adminApis.GET_DEPARTMENT_DETAILS}/${id}/details`);
        return response.data;
    }

    // Gestion des semestres
    async bulkUpdateSemesters(semesters: BulkSemesterUpdateReqDto[]): Promise<any> {
        const response = await this._client.put(adminApis.BULK_UPDATE_SEMESTERS, semesters);
        return response.data;
    }

    async createSemester(semester: CreateSemesterReqDto): Promise<any> {
        const response = await this._client.post(adminApis.CREATE_SEMESTER, semester);
        return response.data;
    }

    async deleteSemester(id: number): Promise<void> {
        await this._client.delete(`${adminApis.DELETE_SEMESTER}/${id}`);
    }

    async getSemesterWindows(id: number): Promise<any> {
        const response = await this._client.get(`${adminApis.GET_SEMESTER_WINDOWS}/${id}/windows`);
        return response.data;
    }
}