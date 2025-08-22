import { useMemo } from 'react';
import { useAppSelector } from '../store';
import {StudentDataResDto} from "../api/reponse-dto/student.res.dto.ts";

interface UseFilteredStudentsProps {
    currentLevel: string; // level1, level2, level3, level4, level5
}

export const useFilteredStudents = ({ currentLevel }: UseFilteredStudentsProps) => {
    const { assignedSubjects } = useAppSelector(state => state.subjects);
    const students = useAppSelector(state => state.user.students);

    const filteredStudents = useMemo(() => {
        if (!students.length || !assignedSubjects.length) return [];

        // Obtenir les codes des matières enseignées par l'enseignant pour ce niveau
        const teacherSubjectCodes = assignedSubjects
            .filter(subject => subject.level === currentLevel)
            .map(subject => subject.code);

        if (teacherSubjectCodes.length === 0) return [];

        // Filtrer les étudiants du niveau approprié qui suivent au moins une matière de l'enseignant
        const levelStudents = students.filter((student: StudentDataResDto) => {
            // Vérifier si l'étudiant est du bon niveau
            if (student.level !== currentLevel) return false;

            // Vérifier si l'étudiant suit au moins une matière enseignée par cet enseignant
            const studentSubjectCodes = student.topics?.map(topic => topic.code) || [];
            return teacherSubjectCodes.some(teacherCode =>
                studentSubjectCodes.includes(teacherCode)
            );
        });

        return levelStudents;
    }, [students, assignedSubjects, currentLevel]);

    const teacherSubjectsForLevel = useMemo(() => {
        return assignedSubjects.filter(subject => subject.level === currentLevel);
    }, [assignedSubjects, currentLevel]);

    return {
        filteredStudents,
        teacherSubjectsForLevel,
        hasStudents: filteredStudents.length > 0,
        studentCount: filteredStudents.length
    };
};
