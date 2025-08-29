import { useAppSelector } from '../store';
import { useMemo } from 'react';

export const useStudentsByLevel = () => {
    const { profile } = useAppSelector(state => state.user);
    const students = useAppSelector(state => state.admin?.students || []);
    
    return useMemo(() => {
        if (!profile?.subjects?.length) {
            return { levels: [], total: 0 };
        }
        
        // Extraire les niveaux des matières enseignées
        const teacherLevels = [...new Set(profile.subjects.map(s => s.level))];
        
        // Grouper les étudiants par niveau
        const levelCounts = teacherLevels.map(level => {
            const count = students.filter(s => s.level === level).length;
            const percentage = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
            
            return {
                level,
                count,
                percentage
            };
        }).filter(item => item.count > 0);
        
        return {
            levels: levelCounts,
            total: students.length
        };
    }, [profile?.subjects, students]);
};