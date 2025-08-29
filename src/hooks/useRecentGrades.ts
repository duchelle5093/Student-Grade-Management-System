import { useAppSelector } from '../store';
import { useMemo } from 'react';

export const useRecentGrades = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const recentGrades = teacherGrades.filter(grade => {
            const gradeDate = new Date(grade.createdDate || grade.lastModifiedDate || now);
            return gradeDate >= yesterday;
        });
        
        return {
            count: recentGrades.length,
            grades: recentGrades
        };
    }, [teacherGrades]);
};