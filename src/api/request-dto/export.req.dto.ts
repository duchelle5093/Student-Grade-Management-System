export interface ExportGradesReqDto {
    level?: string;
    subjectId?: number;
    documentType: string;
    periodLabel?: string;
    semesterId?: number;
    studentIds?: number[]; // Pour filtrer par étudiants spécifiques
}

export interface ExportResultResDto {
    message: string;
    status: string;
    data: any;
    downloadUrl?: string; // Si l'API retourne une URL de téléchargement
}