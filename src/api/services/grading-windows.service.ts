import { AxiosInstance } from 'axios';

export interface GradingWindowResponse {
    id: number;
    name: string;
    shortName: string;
    type: string;
    semester: number;
    startDate: string;
    endDate: string;
    color: string;
    isActive: boolean;
    order: number;
    createdDate: string;
    lastModifiedDate: string;
}

export interface GradingWindowRequest {
    semesterId: number;
    name: string;
    shortName: string;
    type: string;
    startDate: string;
    endDate: string;
    color?: string;
    isActive?: boolean;
    order?: number;
}

const gradingWindowsApis = {
    GET_ALL_GRADING_WINDOWS: 'grading-windows',
    CREATE_GRADING_WINDOW: 'grading-windows',
    UPDATE_GRADING_WINDOW: 'grading-windows',
    DELETE_GRADING_WINDOW: 'grading-windows',
};

export class GradingWindowsService {
    protected readonly _client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async getAllGradingWindows(): Promise<GradingWindowResponse[]> {
        const response = await this._client.get<GradingWindowResponse[]>(gradingWindowsApis.GET_ALL_GRADING_WINDOWS);
        return response.data;
    }

    async createGradingWindow(windowData: GradingWindowRequest): Promise<GradingWindowResponse> {
        const response = await this._client.post<GradingWindowResponse>(gradingWindowsApis.CREATE_GRADING_WINDOW, windowData);
        return response.data;
    }

    async updateGradingWindow(id: number, windowData: GradingWindowRequest): Promise<GradingWindowResponse> {
        const response = await this._client.put<GradingWindowResponse>(`${gradingWindowsApis.UPDATE_GRADING_WINDOW}/${id}`, windowData);
        return response.data;
    }

    async deleteGradingWindow(id: number): Promise<void> {
        await this._client.delete(`${gradingWindowsApis.DELETE_GRADING_WINDOW}/${id}`);
    }
}