import { AxiosInstance } from 'axios';
import { StudentDataResDto } from '../reponse-dto/student.res.dto';
import {CreateSubjectReqDto, SubjectResDto} from '../reponse-dto/subjects.res.dto';

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
    DELETE_USER: 'users',
    
    // Enseignants
    GET_TEACHERS: 'teachers',
    CREATE_TEACHER: 'admin/sub-teachers',
    UPDATE_TEACHER: 'admin/teachers', // Peut-être que l'endpoint est sous /admin
    DELETE_TEACHER: 'teachers',
    UPDATE_STUDENT: 'admin/students', // Peut-être que l'endpoint est sous /admin
    
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

    async getAllTeachers(): Promise<any[]> {
        const response = await this._client.get<any[]>(adminApis.GET_TEACHERS);
        return response.data;
    }

    async createUser(userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        // Champs spécifiques aux étudiants
        level?: string;
        matricule?: string;
        speciality?: string;
        cycle?: string;
        // Champs spécifiques aux enseignants
        levels?: string[];
        department?: string;
        phone?: string;
    }): Promise<any> {
        // Construire le payload selon le rôle
        let payload: any = {
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role
        };

        if (userData.role === Role.STUDENT) {
            payload.level = userData.level;
            payload.matricule = userData.matricule;
            payload.speciality = userData.speciality;
            payload.cycle = userData.cycle;
        } else if (userData.role === Role.TEACHER) {
            payload.levels = userData.levels;
            payload.department = userData.department;
            payload.phone = userData.phone;
        }
        
        // Nettoyer le payload - supprimer les valeurs undefined
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
                delete payload[key];
            }
        });
        
        console.log('Clean payload sent to API:', payload); // Debug
        
        const response = await this._client.post(adminApis.REGISTER_USER, payload);
        return response.data;
    }

    // Gestion des enseignants

    async createTeacher(teacher: CreateTeacherReqDto): Promise<any> {
        const response = await this._client.post(adminApis.CREATE_TEACHER, teacher);
        return response.data;
    }

    // Mise à jour des utilisateurs
    async updateStudent(id: number, studentData: {
        firstName: string;
        lastName: string;
        email: string;
        level: string;
        matricule: string;
        speciality: string;
        cycle: string;
    }): Promise<any> {
        console.log('Calling PUT', `${adminApis.UPDATE_STUDENT}/${id}`, 'with data:', studentData); // Debug
        const response = await this._client.put(`${adminApis.UPDATE_STUDENT}/${id}`, studentData);
        return response.data;
    }

    async updateTeacher(id: number, teacherData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        department: string;
        levels: string[];
    }): Promise<any> {
        const response = await this._client.put(`${adminApis.UPDATE_TEACHER}/${id}`, teacherData);
        return response.data;
    }

    // Suppression d'utilisateurs
    async deleteUser(id: number): Promise<void> {
        await this._client.delete(`${adminApis.DELETE_USER}/${id}`);
    }

    async deleteTeacher(id: number): Promise<void> {
        await this._client.delete(`${adminApis.DELETE_TEACHER}/${id}`);
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

    async updateSubject(id: number, subject: any): Promise<SubjectResDto> {
        const response = await this._client.put<SubjectResDto>(`${adminApis.GET_ALL_SUBJECTS}/${id}`, subject);
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

    // Changement de département utilisateur
    async switchUserDepartment(deptId: number): Promise<any> {
        const response = await this._client.post(`departments/switch/${deptId}`);
        return response.data;
    }

    // Fenêtres de notation
    async getAllGradingWindows(): Promise<any[]> {
        const response = await this._client.get('grading-windows');
        return response.data;
    }

    async createGradingWindow(windowData: any): Promise<any> {
        const response = await this._client.post('grading-windows', windowData);
        return response.data;
    }

    async updateGradingWindow(windowData: any): Promise<any> {
        const response = await this._client.put(`grading-windows/${windowData.id}`, windowData);
        return response.data;
    }
}