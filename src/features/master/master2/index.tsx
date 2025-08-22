import { GradesHeader } from "../../../components/LicenceHeader";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { EditableGradesTable } from "../../../components/EditableGradesTable";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { studentResDto } from "../../../api/reponse-dto/user.res.dto";
import { FakeStudents } from "../../user/data";
import { EmptyGrade } from "../../../components/EmptyGrade";

import { useCurrentPeriod } from "../../../hooks";
import {fetchAssignedSubjects} from "../../subjects";
import {createGrade, fetchTeacherGrades} from "../../grades";
import {fetchStudents} from "../../user/actions.ts";
import {CreateGradeReqDto} from "../../../api/reponse-dto/grade.res.dto.ts";
import {useNotification} from "../../../contexts";
import {fetchActiveSemester} from "../../semesters";

export const Master2 = () => {
    const dispatch = useAppDispatch();
    const { assignedSubjects} = useAppSelector(state => state.subjects);
    // const { teacherGrades, loading: gradesLoading } = useAppSelector(state => state.grades);
    const { formattedPeriod, editableColumns, currentPeriodLabel } = useCurrentPeriod();
    const { activeSemester } = useAppSelector(state => state.semesters);
    const {  teacherGrades } = useAppSelector(state => state.grades);
    const {notify} = useNotification()

    const user = useAppSelector((state) => state.auth.userInfo);
    // const students = useAppSelector(state => state.user.students);

    const [isTableEditable, setIsTableEditable] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [editedData, setEditedData] = useState<studentResDto[]>(FakeStudents);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [showTable, setShowTable] = useState(false);

    usePageTitle(
        isTableEditable ? "Edition des notes de Master 2" : "Notes Master 2"
    );

    // Colonnes dynamiques selon la période
    const extraColumns: { title: string; dataIndex: string }[] = [];
    // Ici vous pouvez ajouter des colonnes supplémentaires selon vos besoins

    const [dataTable, setDataTable] = useState<studentResDto[]>(FakeStudents);


    // Filter subjects for master 2 (LEVEL4 and BACHELOR cycle)
    const licence1Subjects = useMemo(() => {
        return assignedSubjects.filter(subject =>
            subject.level === "LEVEL4" && subject.cycle === "BACHELOR"
        );
    }, [assignedSubjects]);

    // Set first subject as selected if available
    useEffect(() => {
        if (licence1Subjects.length > 0 && !selectedSubject) {
            setSelectedSubject(licence1Subjects[0]);
        }
    }, [licence1Subjects, selectedSubject]);


    const handleEdit = () => {
        setEditedData(dataTable);
        setIsTableEditable(true);
    };

    // useEffect(() => {
    //   dispatch(fetchStudents());
    // }, [dispatch]);

    // Fonction pour confirmer et envoyer les notes
    const handleConfirm = async () => {

        try {

            const currentDate = new Date().toISOString().split('T')[0];
            const gradesToSubmit: CreateGradeReqDto[] = [];

            for (const student of editedData) {
                const gradeField = editableColumns[0]; //  premier champ éditable (cc1, sn1, etc.)
                const gradeValue = student[gradeField];

                if (gradeValue !== undefined && gradeValue !== null && gradeValue !== '') {
                    gradesToSubmit.push({
                        studentId: student.id,
                        subjectId: selectedSubject?.id || 1,
                        semesterId: activeSemester?.id || 1,
                        value: parseFloat(gradeValue) ,
                        type: 'ASSIGNMENT',
                        periodLabel: currentPeriodLabel ,
                        comments: `Note ajoutée le ${currentDate}`,
                        enteredBy: user?.id || 1
                    });
                }
            }

            if (gradesToSubmit.length === 0) {
                console.warn('Aucune note valide à enregistrer');
                return;
            }

            gradesToSubmit.map(gradeData =>
                dispatch(createGrade(gradeData)).unwrap()
            )

            setDataTable(editedData);
            setIsTableEditable(false);
            dispatch(fetchTeacherGrades());
            notify({
                type: "success",
                message: "Success",
                description: `Notes enregistrées avec succès`
            })
        } catch (error) {
            notify({
                type: "error",
                message: "Erreur",
                description: `Erreur lors de l'enregistrement des notes: ${error}`
            })
        }
    };

    const filteredTableData = useMemo(() => {
        const base = isTableEditable ? editedData : dataTable;
        if (!searchValue) return base;
        return base.filter((student) =>
            (student.firstName || "")
                .toLowerCase()
                .includes(searchValue.toLowerCase())
        );
    }, [searchValue, dataTable, editedData, isTableEditable]);

    // Détermine si au moins une note a été attribuée à un étudiant
    const gradeFields = ["cc1", "sn1", "cc2","sn2"];
    const hasAtLeastOneGrade = dataTable.some(student =>
        gradeFields.some(field => {
            const value = student[field];
            return value !== undefined && value !== null && value !== '';
        })
    );


    useEffect(() => {
        dispatch(fetchAssignedSubjects());
        dispatch(fetchTeacherGrades());
        dispatch(fetchStudents());
        dispatch(fetchActiveSemester());
    }, [dispatch]);


    return (
        <div>
            <GradesHeader
                title="M2"
                period={formattedPeriod}
                topic={teacherGrades[0]?.subjectName || "Matière"}
                code={teacherGrades[0]?.subjectCode  || "CODE"}
                level="Master 2"
                NC="10"
                CANT="20"
            />
            <div className="mt-8">
                {hasAtLeastOneGrade || showTable ? (
                    <EditableGradesTable
                        extraColumns={extraColumns}
                        isEditable={isTableEditable}
                        data={filteredTableData}
                        onGradesChange={setEditedData}
                        onEdit={handleEdit}
                        onConfirm={handleConfirm}
                        isDataEditable={isTableEditable}
                        setIsDataEditable={setIsTableEditable}
                        onSearch={setSearchValue}
                        editableColumns={editableColumns}
                    />
                ) : (
                    <EmptyGrade setShowTable={setShowTable}/>
                )}
            </div>
        </div>
    );
};

