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
            acc[key] = { cc: 0, sn: 0 };
        }
        if (grade.periodLabel === 'CC_1' || grade.periodLabel === 'CC_2') {
            acc[key].cc = grade.value;
        }
        if (grade.periodLabel === 'SN_1' || grade.periodLabel === 'SN_2') {
            acc[key].sn = grade.value;
        }
        return acc;
    }, {} as Record<string, { cc: number; sn: number }>);

    let failed = 0;
    let passed = 0;

    Object.values(grouped).forEach(subject => {
        const total = subject.cc + subject.sn;
        if (total >= 50) passed++;
        else failed++;
    });

    return { failed, passed };
};

export default function StudentPage() {
    const dispatch = useAppDispatch();
    const student = useAppSelector((state) => state.user.profile);
    const studentGrades =  useAppSelector((state) => state.grades.studentGrades);

    // Utiliser les mock data si pas de données réelles
    const currentStudentData = student?.grades?.length > 0 
        ? student 
        : (Array.isArray(studentGrades) && studentGrades.length > 0)
            ? studentGrades.find(grade => grade.studentId === student?.id)
            : mockStudentData;

    const { failed, passed } = useMemo(
        () => countFailedSubjects(currentStudentData),
        [currentStudentData]
    );

    useEffect(()=>{
        dispatch(fetchStudentGrades(student?.id))
    } , [student?.id , dispatch])



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
                    <p>Période en cours : <span>{currentStudentData?.semesterName || 'Non définie'}</span></p>
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
