/**
 * Détermine quelles colonnes sont éditables selon la période actuelle
 * @param periodLabel - Le label de la période actuelle (ex: "CC #1", "SN #1", "CC #2", "SN #2")
 * @returns Array des colonnes éditables (cc1, sn1, cc2, sn2)
 */
export const getEditableColumnsByPeriod = (periodLabel: string): string[] => {
    const normalized = periodLabel?.toLowerCase().trim();

    const map: Record<string, string[]> = {
        "cc #1": ["cc1"],
        "sn #1": ["sn1"],
        "cc #2": ["cc2"],
        "sn #2": ["sn2"],
        "all": ["cc1", "sn1", "cc2", "sn2"],
    };

    return map[normalized] || ["cc1"];
};

/**
 * Formate le nom d'une période pour l'affichage lisible
 * @param periodLabel - Le label brut de la période (ex: "CC #1")
 * @returns Le nom formaté (ex: "Contrôle Continu #1")
 */
export const formatPeriodLabel = (periodLabel: string): string => {
    if (!periodLabel) return "Période non définie";

    const normalized = periodLabel.toLowerCase().trim();

    const formatMap: Record<string, string> = {
        "cc #1": "Contrôle Continu #1",
        "sn #1": "Session Normale #1",
        "cc #2": "Contrôle Continu #2",
        "sn #2": "Session Normale #2",
    };

    return formatMap[normalized] || periodLabel;
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
