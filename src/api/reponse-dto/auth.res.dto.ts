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
    mustChangePassword: boolean;
    levels?: string[]; // Niveaux enseignés par l'enseignant
}

export interface ChangePasswordReqDto{
   newPassword: string ;
   confirmPassword: string;
}