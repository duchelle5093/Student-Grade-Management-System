import { useAppSelector } from '../store';
import { useMemo } from 'react';

export const useRecentActivity = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        // Générer des activités récentes basées sur les notes
        const recentActivities = teacherGrades
            .slice(-4) // Prendre les 4 dernières notes
            .map((grade, index) => ({
                type: 'grade',
                name: `Note ${grade.type}`,
                action: `Note saisie (${grade.value}/20)`,
                time: `${(index + 1) * 15} min`,
                avatar: grade.type.charAt(0)
            }));
        
        // Ajouter des activités par défaut si pas assez de données
        while (recentActivities.length < 4) {
            recentActivities.push({
                type: 'system',
                name: 'Système',
                action: 'Aucune activité récente',
                time: '1h',
                avatar: 'S'
            });
        }
        
        return recentActivities;
    }, [teacherGrades]);
};