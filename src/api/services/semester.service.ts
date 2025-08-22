import {AxiosInstance} from 'axios';
import {SemesterResDto} from "../reponse-dto/semester.res.dto";

const semesterApis = {
    GET_SEMESTERS: 'semesters',
};

export class SemesterService {
    protected readonly _client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async getSemesters(): Promise<SemesterResDto[]> {
        const response = await this._client.get<SemesterResDto[]>(
            semesterApis.GET_SEMESTERS
        );
        return response.data;
    }

    async getActiveSemester(): Promise<SemesterResDto | null> {
        const semesters = await this.getSemesters();
        return semesters.find(semester => semester.active) || null;
    }
}
