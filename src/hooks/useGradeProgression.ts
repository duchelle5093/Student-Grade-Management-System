import { useAppSelector } from '../store';
import { useMemo } from 'react';

export const useGradeProgression = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        // Simuler une progression basée sur les notes existantes
        const totalGrades = teacherGrades.length;
        
        if (totalGrades === 0) {
            return {
                progressRate: 0,
                improvements: 0,
                declines: 0,
                stable: 0
            };
        }
        
        // Calculs simplifiés basés sur les données existantes
        const averageGrade = teacherGrades.reduce((sum, grade) => sum + grade.value, 0) / totalGrades;
        const progressRate = Math.min(Math.round((averageGrade / 20) * 100), 100);
        
        // Répartition simulée
        const improvements = Math.round(totalGrades * 0.4);
        const declines = Math.round(totalGrades * 0.2);
        const stable = totalGrades - improvements - declines;
        
        return {
            progressRate,
            improvements,
            declines,
            stable
        };
    }, [teacherGrades]);
};