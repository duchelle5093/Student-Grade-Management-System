/**
 * Détermine quelles colonnes sont éditables selon la période actuelle
 * @param periodLabel - Le label de la période actuelle (ex: "CC1", "SN1", "CC2", "SN2")
 * @returns Array des colonnes éditables
 */
export const getEditableColumnsByPeriod = (periodLabel: string): string[] => {
    const normalizedPeriod = periodLabel?.toLowerCase() || "";

    // Mapping des périodes vers les colonnes éditables
    const periodToColumns: Record<string, string[]> = {
        'cc1': ['cc1'],
        'controle continu 1': ['cc1'],
        'contrôle continu 1': ['cc1'],
        'controle continu #1': ['cc1'],
        'contrôle continu #1': ['cc1'],

        'sn1': ['sn1'],
        'session normale 1': ['sn1'],
        'session normale #1': ['sn1'],

        'cc2': ['cc2'],
        'controle continu 2': ['cc2'],
        'contrôle continu 2': ['cc2'],
        'controle continu #2': ['cc2'],
        'contrôle continu #2': ['cc2'],

        'sn2': ['sn2'],
        'session normale 2': ['sn2'],
        'session normale #2': ['sn2'],

        // Périodes mixtes
        'cc1+sn1': ['cc1', 'sn1'],
        'cc2+sn2': ['cc2', 'sn2'],
        'all': ['cc1', 'sn1', 'cc2', 'sn2'],
    };

    // Chercher dans le mapping
    for (const [key, columns] of Object.entries(periodToColumns)) {
        if (normalizedPeriod.includes(key)) {
            return columns;
        }
    }

    // Par défaut, permettre l'édition de CC1 si aucune correspondance
    return ['cc1'];
};

/**
 * Formate le nom d'une période pour l'affichage
 * @param periodLabel - Le label de la période
 * @returns Le nom formaté de la période
 */
export const formatPeriodLabel = (periodLabel: string): string => {
    if (!periodLabel) return "Période non définie";

    const normalized = periodLabel.toLowerCase();

    const formatMap: Record<string, string> = {
        'cc1': 'Contrôle Continu #1',
        'sn1': 'Session Normale #1',
        'cc2': 'Contrôle Continu #2',
        'sn2': 'Session Normale #2',
    };

    for (const [key, formatted] of Object.entries(formatMap)) {
        if (normalized.includes(key)) {
            return formatted;
        }
    }

    // Retourner le label original si aucune correspondance
    return periodLabel;
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
