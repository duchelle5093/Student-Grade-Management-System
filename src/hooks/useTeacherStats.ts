import { useMemo } from 'react';
import { useAppSelector } from '../store';
import { useTeacherLevels } from './useTeacherLevels';

export const useRecentGrades = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        const recentGrades = teacherGrades.filter(grade => 
            new Date(grade.createdDate) >= last24h ||
            (grade.lastModifiedDate && new Date(grade.lastModifiedDate) >= last24h)
        );
        
        return {
            grades: recentGrades,
            count: recentGrades.length,
            byPeriod: recentGrades.reduce((acc, grade) => {
                acc[grade.periodLabel] = (acc[grade.periodLabel] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };
    }, [teacherGrades]);
};

export const useStudentsByLevel = () => {
    const students = useAppSelector(state => state.user.students);
    const { uniqueLevels } = useTeacherLevels();
    
    return useMemo(() => {
        const byLevel = uniqueLevels.reduce((acc, level) => {
            // Compter les étudiants qui ont au moins une matière de ce niveau
            acc[level] = students.filter(student => 
                student.subjects?.some(subject => subject.level === level)
            ).length;
            return acc;
        }, {} as Record<string, number>);
        
        const total = Object.values(byLevel).reduce((sum, count) => sum + count, 0);
        
        return {
            byLevel,
            total,
            levels: Object.entries(byLevel).map(([level, count]) => ({
                level,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0
            }))
        };
    }, [students, uniqueLevels]);
};

export const useGradeProgression = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        // Grouper par étudiant
        const gradesByStudent = teacherGrades.reduce((acc, grade) => {
            if (!acc[grade.studentId]) acc[grade.studentId] = [];
            acc[grade.studentId].push(grade);
            return acc;
        }, {} as Record<number, any[]>);
        
        const progressions: Array<{
            studentId: number;
            improvement: number;
            type: 'progress' | 'decline' | 'stable';
        }> = [];
        
        // Calculer progression CC → SN pour chaque semestre
        Object.entries(gradesByStudent).forEach(([studentId, grades]) => {
            // Semestre 1
            const cc1 = grades.find(g => g.periodLabel === 'CC_1')?.value;
            const sn1 = grades.find(g => g.periodLabel === 'SN_1')?.value;
            
            if (cc1 !== undefined && sn1 !== undefined) {
                const improvement = sn1 - cc1;
                progressions.push({
                    studentId: Number(studentId),
                    improvement,
                    type: improvement > 0 ? 'progress' : improvement < 0 ? 'decline' : 'stable'
                });
            }
            
            // Semestre 2
            const cc2 = grades.find(g => g.periodLabel === 'CC_2')?.value;
            const sn2 = grades.find(g => g.periodLabel === 'SN_2')?.value;
            
            if (cc2 !== undefined && sn2 !== undefined) {
                const improvement = sn2 - cc2;
                progressions.push({
                    studentId: Number(studentId),
                    improvement,
                    type: improvement > 0 ? 'progress' : improvement < 0 ? 'decline' : 'stable'
                });
            }
        });
        
        const improvements = progressions.filter(p => p.type === 'progress').length;
        const declines = progressions.filter(p => p.type === 'decline').length;
        const stable = progressions.filter(p => p.type === 'stable').length;
        
        return {
            total: progressions.length,
            improvements,
            declines,
            stable,
            averageImprovement: progressions.length > 0 
                ? progressions.reduce((sum, p) => sum + p.improvement, 0) / progressions.length 
                : 0,
            progressRate: progressions.length > 0 
                ? Math.round((improvements / progressions.length) * 100) 
                : 0
        };
    }, [teacherGrades]);
};

export const useRecentActivity = () => {
    const { teacherGrades } = useAppSelector(state => state.grades);
    
    return useMemo(() => {
        const now = new Date();
        const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentActivities = teacherGrades
            .filter(grade => 
                new Date(grade.createdDate) >= last7days ||
                (grade.lastModifiedDate && new Date(grade.lastModifiedDate) >= last7days)
            )
            .sort((a, b) => {
                const dateA = new Date(a.lastModifiedDate || a.createdDate);
                const dateB = new Date(b.lastModifiedDate || b.createdDate);
                return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5) // Dernières 5 activités
            .map(grade => {
                const isUpdate = !!grade.lastModifiedDate;
                const date = new Date(grade.lastModifiedDate || grade.createdDate);
                const timeAgo = getTimeAgo(date);
                
                return {
                    type: 'grade' as const,
                    name: `${grade.subjectName} ${grade.periodLabel}`,
                    action: isUpdate ? 'Note modifiée' : 'Note ajoutée',
                    time: timeAgo,
                    avatar: grade.subjectCode?.charAt(0) || 'N',
                    studentName: grade.studentName,
                    value: grade.value
                };
            });
        
        return recentActivities;
    }, [teacherGrades]);
};

// Fonction utilitaire pour calculer le temps écoulé
const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}j`;
};