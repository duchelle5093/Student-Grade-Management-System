// Fichier supprimé - utilisation uniquement des données API
// Les réclamations sont maintenant gérées via les actions Redux :
// - submitGradeClaim
// - approveGradeClaim  
// - rejectGradeClaim
// - listGradeClaims

// Interface legacy - utiliser GradeClaimResDto à la place
export interface ClaimData {
    id: string;
    period: 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2';
    status: "PENDING" | "APPROVED" | "REJECTED";
    requestedScore: number;
    cause: string;
    description: string;
    createdAt: string;
}

export interface GradeWithClaims {
    subjectCode: string;
    subjectName: string;
    cc1: number | null;
    cc2: number | null;
    sn1: number | null;
    sn2: number | null;
    claims?: ClaimData[];
}

export interface StudentWithClaims {
    id: number;
    firstName: string;
    lastName: string;
    studentId: string;
    grades: GradeWithClaims[];
}