import {useEffect, useMemo} from 'react';
import GradesTable from "./views/GradesTable.tsx";
import {useAppDispatch, useAppSelector} from "../../store";
import { StudentDataResDto } from "../../api/reponse-dto/student.res.dto";
import {fetchStudentGrades} from "../grades";

const countFailedSubjects = (studentData: StudentDataResDto ): { failed: number; passed: number } => {

    if (!studentData?.topics?.length) return { failed: 0, passed: 0 };

    let failed = 0;
    let passed = 0;

    studentData.topics.forEach(topic => {
        const cc = topic.cc || 0;
        const sn = topic.sn || 0;
        const total = cc + sn;

        if (total < 50) {
            failed++;
        } else {
            passed++;
        }
    });
    return { failed, passed };
};

export default function StudentPage() {
    const dispatch = useAppDispatch();
    const student = useAppSelector((state) => state.user.profile);
    const studentGrades =  useAppSelector((state) => state.grades.studentGrades);

    const { failed, passed } = useMemo(
        () => countFailedSubjects(student),
        [student]
    );

    const studentGrade = Array.isArray(studentGrades) ? studentGrades.find(grade => grade.studentId === student?.id) : null;

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
                    <p>Période en cours : <span>{studentGrade?.semesterName}</span></p>
                    <p>Niveau : <span>Étudiant</span></p>
                </div>
                <div>
                    <p>Échec : <span className="text-red-500 font-bold">{failed}</span></p>
                    <p>Réussite : <span className="text-green-500 font-bold">{passed}</span></p>
                </div>
            </div>

            <GradesTable student={studentGrade} />
        </div>
    );
}
