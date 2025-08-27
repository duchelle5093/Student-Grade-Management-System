import {useEffect, useMemo} from 'react';
import GradesTable from "./views/GradesTable.tsx";
import {useAppDispatch, useAppSelector} from "../../store";
import { StudentDataResDto } from "../../api/reponse-dto/student.res.dto";
import {fetchStudentGrades} from "../grades";
import { mockStudentData } from "./mockData";

const countFailedSubjects = (studentData: StudentDataResDto): { failed: number; passed: number } => {
    if (!studentData?.grades?.length) return { failed: 0, passed: 0 };

    // Regrouper les notes par matière
    const grouped = studentData.grades.reduce((acc, grade) => {
        const key = grade.subjectCode;
        if (!acc[key]) {
            acc[key] = { passed: false };
        }
        // Utiliser la propriété passed du backend
        acc[key].passed = grade.passed;
        return acc;
    }, {} as Record<string, { passed: boolean }>);

    let failed = 0;
    let passed = 0;

    Object.values(grouped).forEach(subject => {
        if (subject.passed) passed++;
        else failed++;
    });

    return { failed, passed };
};

export default function StudentPage() {
    const dispatch = useAppDispatch();
    const student = useAppSelector((state) => state.user.profile);
    const studentGrades =  useAppSelector((state) => state.grades.studentGrades);

    // Utiliser les données réelles ou fallback sur mock data
    const currentStudentData = (studentGrades && studentGrades.grades?.length > 0) 
        ? studentGrades 
        : (student?.grades?.length > 0)
            ? student
            : mockStudentData;

    const { failed, passed } = useMemo(
        () => countFailedSubjects(currentStudentData),
        [currentStudentData]
    );

    useEffect(()=>{
        dispatch(fetchStudentGrades(student?.id));
    } , [student?.id , dispatch]);


    // if (!currentStudent) {
    //     return (
    //         <div className="flex items-center justify-center h-64">
    //             <div className="text-gray-500">Aucune donnée disponible</div>
    //         </div>
    //     );
    // }

    return (
        <div>
            <div className={'py-5 border-b mb-5'}>
                <span className={'text-3xl font-bold'}>Liste des notes</span>
            </div>

            <div className={'w-full flex justify-between my-12'}>
                <div>
                    <p>Semestre en cours : <span className="font-semibold text-blue-600">{currentStudentData?.semesterName ? `Semestre ${currentStudentData.semesterName}` : 'Non défini'}</span></p>
                    <p>Niveau : <span>{currentStudentData?.level || 'Étudiant'}</span></p>
                </div>
                <div>
                    <p>Échec : <span className="text-red-500 font-bold">{failed}</span></p>
                    <p>Réussite : <span className="text-green-500 font-bold">{passed}</span></p>
                </div>
            </div>

            <GradesTable student={currentStudentData} />
        </div>
    );
}
