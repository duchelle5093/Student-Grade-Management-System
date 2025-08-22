import {AxiosInstance} from 'axios';
import {LoginreqDto, RegisterReqDto} from "../request-dto/auth.req.ts";
import {ChangePasswordReqDto, LoginResDto} from "../reponse-dto/auth.res.dto.ts";

const authApis = {
    LOGIN: 'auth/login',
    REGISTER : 'auth/register',
    CHANGE_PASSWORD : 'auth/change-password',
};

export class AuthService {
    protected readonly _client: AxiosInstance;
    constructor(client: AxiosInstance) {
        this._client = client;
    }

    async login(req:LoginreqDto) {
        const response = await this._client.post<LoginResDto>(
            authApis.LOGIN,
            req
        );
        return response.data;
    }

    async register(req:RegisterReqDto){
        const response = await this._client.post<RegisterReqDto>(
            authApis.REGISTER,
            req
        )

        return response.data;
    }

    async changePassword(req:Partial<ChangePasswordReqDto>){
        const response = await this._client.post<ChangePasswordReqDto>(
            authApis.CHANGE_PASSWORD,
            req
        )
        return response.data;
    }
}
