export interface LoginResDto{
    token: string;
    refreshToken: null;
    type: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    authorities: [],
    mustChangePassword: boolean
}

export interface ChangePasswordReqDto{
   currentPassword: string;
   newPassword: string ;
   confirmPassword: string;
   oldPassword: string
}