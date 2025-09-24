interface StudentGradeRow {
    studentId: number;
    studentName: string;
    cc1: number | null;
    sn1: number | null;
    cc2: number | null;
    sn2: number | null;
}

interface ActivePeriod {
    endDate?: string;
    startDate?: string;
    shortName?: string;
    name?: string;
}

/**
 * Calcule le taux de réussite des étudiants
 * @param students - Liste des étudiants avec leurs notes
 * @param passingGrade - Note minimale pour réussir (défaut: 10)
 * @returns Pourcentage de réussite (0-100)
 */
export const calculateSuccessRate = (
    students: StudentGradeRow[], 
    passingGrade: number = 10
): number => {
    if (!students?.length) return 0;
    
    const studentsWithPassingGrades = students.filter(student => {
        const hasPassingGrade = [student.cc1, student.sn1, student.cc2, student.sn2]
            .some(grade => grade !== null && grade !== undefined && grade >= passingGrade);
        return hasPassingGrade;
    });
    
    return Math.round((studentsWithPassingGrades.length / students.length) * 100);
};

/**
 * Calcule le nombre de jours restants avant la fin de la période active
 * @param activePeriod - Période académique active
 * @returns Nombre de jours restants (minimum 0)
 */
export const calculateDaysRemaining = (activePeriod?: ActivePeriod): number => {
    if (!activePeriod?.endDate) return 0;
    
    const today = new Date();
    const endDate = new Date(activePeriod.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
};

/**
 * Calcule la moyenne de la classe pour une période donnée
 * @param students - Liste des étudiants avec leurs notes
 * @param period - Période à analyser ('cc1', 'sn1', 'cc2', 'sn2')
 * @returns Moyenne de la classe (0 si aucune note)
 */
export const calculateClassAverage = (
    students: StudentGradeRow[], 
    period: keyof Pick<StudentGradeRow, 'cc1' | 'sn1' | 'cc2' | 'sn2'>
): number => {
    if (!students?.length) return 0;
    
    const validGrades = students
        .map(student => student[period])
        .filter(grade => grade !== null && grade !== undefined) as number[];
    
    if (validGrades.length === 0) return 0;
    
    const sum = validGrades.reduce((acc, grade) => acc + grade, 0);
    return Math.round((sum / validGrades.length) * 100) / 100; // 2 décimales
};

/**
 * Compte le nombre d'étudiants ayant au moins une note
 * @param students - Liste des étudiants avec leurs notes
 * @returns Nombre d'étudiants avec des notes
 */
export const countStudentsWithGrades = (students: StudentGradeRow[]): number => {
    if (!students?.length) return 0;
    
    return students.filter(student => {
        const hasAnyGrade = [student.cc1, student.sn1, student.cc2, student.sn2]
            .some(grade => grade !== null && grade !== undefined);
        return hasAnyGrade;
    }).length;
};

/**
 * Détermine la couleur selon les jours restants
 * @param daysRemaining - Nombre de jours restants
 * @returns Objet avec les classes CSS pour background et text
 */
export const getDaysRemainingColors = (daysRemaining: number) => {
    if (daysRemaining > 7) {
        return {
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        };
    } else if (daysRemaining > 3) {
        return {
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        };
    } else {
        return {
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        };
    }
};