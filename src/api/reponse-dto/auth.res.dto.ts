export interface LoginResDto{
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    role: string[];
}