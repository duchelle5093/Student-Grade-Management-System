import { useMemo } from 'react';
import { useAppSelector } from '../store';


interface UseFilteredStudentsProps {
    currentLevel: string; // level1, level2, level3, level4, level5
}

export const useFilteredStudents = ({ currentLevel }: UseFilteredStudentsProps) => {
    const teacherProfile = useAppSelector(state => state.user.profile);
    const students = useAppSelector(state => state.user.students);

    const filteredStudents = useMemo(() => {
        if (!students?.length || !teacherProfile?.subjects?.length) return [];

        // Obtenir les matières enseignées par l'enseignant pour ce niveau
        const teacherSubjectsForLevel = teacherProfile.subjects
            .filter(subject => subject.level === currentLevel);

        if (teacherSubjectsForLevel.length === 0) return [];

        const teacherSubjectIds = teacherSubjectsForLevel.map(subject => subject.id);

        // Filtrer les étudiants qui suivent au moins une matière de l'enseignant pour ce niveau
        const levelStudents = students.filter((student: any) => {
            // Vérifier si l'étudiant suit au moins une matière enseignée par cet enseignant
            return student.subjects?.some((subject: any) => 
                subject.level === currentLevel && 
                teacherSubjectIds.includes(subject.id)
            );
        });

        return levelStudents;
    }, [students, teacherProfile?.subjects, currentLevel]);

    const teacherSubjectsForLevel = useMemo(() => {
        if (!teacherProfile?.subjects?.length) return [];
        return teacherProfile.subjects.filter(subject => subject.level === currentLevel);
    }, [teacherProfile?.subjects, currentLevel]);

    return {
        filteredStudents,
        teacherSubjectsForLevel,
        hasStudents: filteredStudents.length > 0,
        studentCount: filteredStudents.length
    };
};
