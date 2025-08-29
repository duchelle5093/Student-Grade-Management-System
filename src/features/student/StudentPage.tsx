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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                {/* Titre principal */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-2xl">
                            📊
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Mes Notes</h1>
                            <p className="text-sm text-gray-500">Niveau: {currentStudentData?.level || 'Étudiant'}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Semestre actuel</div>
                        <div className="text-lg font-medium text-blue-600">
                            {currentStudentData?.semesterName ? `Semestre ${currentStudentData.semesterName}` : 'Non défini'}
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{passed}</div>
                        <div className="text-sm text-gray-500">Matières réussies</div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{failed}</div>
                        <div className="text-sm text-gray-500">Matières échouées</div>
                    </div>
                </div>
            </div>

            <GradesTable student={currentStudentData} />
        </div>
    );
}
