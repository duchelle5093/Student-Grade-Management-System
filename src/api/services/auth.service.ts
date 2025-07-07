import {AxiosInstance} from 'axios';
import {LoginreqDto} from "../request-dto/auth.req.ts";
import {LoginResDto} from "../reponse-dto/auth.res.dto.ts";

const authApis = {
   LOGIN: 'auth/login'
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
}
