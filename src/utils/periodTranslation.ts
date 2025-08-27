/**
 * Traduit les noms de périodes de l'anglais vers le français
 * @param englishName - Le nom en anglais venant de l'API
 * @returns Le nom traduit en français
 */
export const translatePeriodName = (englishName?: string): string => {
    if (!englishName) return 'Période non définie';
    
    const translations: Record<string, string> = {
        "Continuous Assessment 1": "Contrôle Continu #1",
        "Continuous Assessment 2": "Contrôle Continu #2", 
        "Normal Session 1": "Session Normale #1",
        "Normal Session 2": "Session Normale #2",
        // Ajoutez d'autres traductions si nécessaire
    };
    
    return translations[englishName] || englishName;
};