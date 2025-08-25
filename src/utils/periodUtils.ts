/**
 * Détermine quelles colonnes sont éditables selon la période actuelle
 * @param periodLabel - Le label de la période actuelle (ex: "CC_1", "SN_1", "CC_2", "SN_2")
 * @returns Array des colonnes éditables (cc1, sn1, cc2, sn2)
 */
export const getEditableColumnsByPeriod = (periodLabel: string): string[] => {
    const normalized = normalizePeriodLabel(periodLabel);
    
    const map: Record<string, string[]> = {
        "CC_1": ["cc1"],
        "SN_1": ["sn1"],
        "CC_2": ["cc2"],
        "SN_2": ["sn2"],
        "ALL": ["cc1", "sn1", "cc2", "sn2"],
    };

    return map[normalized] || ["cc1"];
};

/**
 * Normalise un label de période
 * @param periodLabel - Label brut (ex: "cc_1", "CC 1", "cc1")
 * @returns Label normalisé (ex: "CC_1")
 */
export const normalizePeriodLabel = (periodLabel?: string): string => {
    if (!periodLabel) return "CC_1";
    
    const clean = periodLabel.toUpperCase().replace(/[\s_-]/g, "_");
    
    // Mapping des variations possibles
    const variations: Record<string, string> = {
        "CC1": "CC_1",
        "CC_1": "CC_1",
        "SN1": "SN_1", 
        "SN_1": "SN_1",
        "CC2": "CC_2",
        "CC_2": "CC_2",
        "SN2": "SN_2",
        "SN_2": "SN_2"
    };
    
    return variations[clean] || "CC_1";
};

/**
 * Convertit un label de période vers une clé de colonne
 * @param periodLabel - Label de période (ex: "CC_1")
 * @returns Clé de colonne (ex: "cc1")
 */
export const periodLabelToColumnKey = (periodLabel?: string): string => {
    const normalized = normalizePeriodLabel(periodLabel);
    
    const mapping: Record<string, string> = {
        "CC_1": "cc1",
        "SN_1": "sn1",
        "CC_2": "cc2",
        "SN_2": "sn2"
    };
    
    return mapping[normalized] || "cc1";
};

/**
 * Parse une période pour extraire type et semestre
 * @param periodLabel - Label de période (ex: "CC_1")
 * @returns Objet avec type et semestre
 */
export const parsePeriodLabel = (periodLabel?: string): { type: string; semester: number } => {
    const normalized = normalizePeriodLabel(periodLabel);
    
    const mapping: Record<string, { type: string; semester: number }> = {
        "CC_1": { type: "CC", semester: 1 },
        "SN_1": { type: "SN", semester: 1 },
        "CC_2": { type: "CC", semester: 2 },
        "SN_2": { type: "SN", semester: 2 }
    };
    
    return mapping[normalized] || { type: "CC", semester: 1 };
};

/**
 * Formate le nom d'une période pour l'affichage lisible
 * @param periodLabel - Le label brut de la période (ex: "CC_1")
 * @returns Le nom formaté (ex: "Contrôle Continu #1")
 */
export const formatPeriodLabel = (periodLabel?: string): string => {
    const normalized = normalizePeriodLabel(periodLabel);

    const formatMap: Record<string, string> = {
        "CC_1": "Contrôle Continu #1",
        "SN_1": "Session Normale #1",
        "CC_2": "Contrôle Continu #2",
        "SN_2": "Session Normale #2",
    };

    return formatMap[normalized] || "Période non définie";
};

/**
 * Valide si une note est dans la plage acceptable selon le type de période
 * @param value - Valeur à valider
 * @param periodLabel - Label de la période (CC_1, SN_1, etc.)
 * @returns true si valide
 */
export const isValidGradeValue = (value: any, periodLabel?: string): boolean => {
    if (value === null || value === undefined || value === "") return false;
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) return false;
    
    // Déterminer la note max selon le type de période
    const { type } = parsePeriodLabel(periodLabel);
    const maxValue = type === "CC" ? 30 : 70; // CC: 30, SN: 70
    
    return num <= maxValue;
};

/**
 * Trouve une note existante par étudiant et période
 * @param grades - Liste des notes
 * @param studentId - ID de l'étudiant
 * @param periodLabel - Label de la période
 * @returns Note trouvée ou undefined
 */
export const findExistingGrade = (grades: any[], studentId: number, periodLabel: string): any => {
    const normalized = normalizePeriodLabel(periodLabel);
    return grades.find(g => 
        g.studentId === studentId && 
        normalizePeriodLabel(g.periodLabel) === normalized
    );
};

/**
 * Obtient la note maximale selon le type de période
 * @param periodLabel - Label de la période
 * @returns Note maximale (30 pour CC, 70 pour SN)
 */
export const getMaxGradeValue = (periodLabel?: string): number => {
    const { type } = parsePeriodLabel(periodLabel);
    return type === "CC" ? 30 : 70;
};

interface AcademicPeriod {
    id: string;
    name: string;
    shortName: string;
    type: 'CC' | 'SN';
    semester: 1 | 2;
    startDate: string;
    endDate: string;
    color: string;
    isActive: boolean;
    order: number;
}

/**
 * Récupère la période actuellement active
 * @param periods - Tableau des périodes académiques
 * @returns La période active ou null
 */
export const getCurrentPeriod = (periods: AcademicPeriod[]): AcademicPeriod | null => {
    return periods.find(p => p.isActive) || null;
};

/**
 * Récupère la période suivante selon l'ordre
 * @param periods - Tableau des périodes académiques
 * @param currentOrder - Ordre de la période actuelle
 * @returns La période suivante ou null
 */
export const getNextPeriod = (periods: AcademicPeriod[], currentOrder: number): AcademicPeriod | null => {
    return periods.find(p => p.order === currentOrder + 1) || null;
};

/**
 * Récupère la période précédente selon l'ordre
 * @param periods - Tableau des périodes académiques
 * @param currentOrder - Ordre de la période actuelle
 * @returns La période précédente ou null
 */
export const getPreviousPeriod = (periods: AcademicPeriod[], currentOrder: number): AcademicPeriod | null => {
    return periods.find(p => p.order === currentOrder - 1) || null;
};

/**
 * Détermine si une période est active selon les dates du semestre
 * @param startDate - Date de début du semestre
 * @param endDate - Date de fin du semestre
 * @returns true si la période est active
 */
export const isPeriodActive = (startDate: string, endDate: string): boolean => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return now >= start && now <= end;
};

/**
 * Filtre les périodes par semestre
 * @param periods - Tableau des périodes académiques
 * @param semester - Numéro du semestre (1 ou 2)
 * @returns Tableau des périodes du semestre spécifié
 */
export const getPeriodsBySemester = (periods: AcademicPeriod[], semester: 1 | 2): AcademicPeriod[] => {
    return periods.filter(p => p.semester === semester);
};

/**
 * Filtre les périodes par type
 * @param periods - Tableau des périodes académiques
 * @param type - Type de période ('CC' ou 'SN')
 * @returns Tableau des périodes du type spécifié
 */
export const getPeriodsByType = (periods: AcademicPeriod[], type: 'CC' | 'SN'): AcademicPeriod[] => {
    return periods.filter(p => p.type === type);
};
