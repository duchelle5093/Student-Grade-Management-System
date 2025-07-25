
export type Period = 's1' | 's2'


export interface Topic{
    code: string;
    title: string;
    grade: number | null; // Note associée au sujet, peut être null si pas de note
    semester: Period; // Semestre auquel le sujet est associé
    
}

// export interface Grade{
//     id: number;
//     studentId: number;
//     topicCode: string;
//     value: number;
//     date: string; // Date au format ISO
// }

export interface userProfileResDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
}

export interface studentResDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    topics: Topic[];
    [key: string]: string | number | Topic[] ; // Permet d'ajouter dynamiquement des propriétés
}


