import { AxiosInstance } from 'axios';
import { userProfileResDto } from '../reponse-dto/user.res.dto';
import {StudentListResDto} from "../reponse-dto/student.res.dto.ts";

export const userApis = {
  GET_PROFILE: 'me',
  GET_STUDENTS: 'students',
  CHANGE_PASSWORD: 'auth/change-password',
};

export class UserService {
  protected _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  async getProfile() {
    const res = await this._client.get<userProfileResDto>(
      userApis.GET_PROFILE
    );
    return res.data;
  }

  async getStudents() {
    const res = await this._client.get<StudentListResDto[]>(
      userApis.GET_STUDENTS
    );
    return res.data;
  }
}
