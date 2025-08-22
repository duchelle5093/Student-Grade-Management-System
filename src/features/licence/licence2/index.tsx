import { GradesHeader } from "../../../components/LicenceHeader";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { EditableGradesTable } from "../../../components/EditableGradesTable";
import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { EmptyGrade } from "../../../components/EmptyGrade";
import { useCurrentPeriod, useFilteredStudents } from "../../../hooks";
import { fetchAssignedSubjects } from "../../subjects";
import { createGrade, fetchTeacherGrades } from "../../grades";
import { fetchStudents } from "../../user/actions.ts";
import { CreateGradeReqDto } from "../../../api/reponse-dto/grade.res.dto.ts";
import { useNotification } from "../../../contexts";
import { fetchActiveSemester } from "../../semesters";
import { StudentDataResDto } from "../../../api/reponse-dto/student.res.dto.ts";
import { AcademicLevel, PeriodLabel } from "../../../api/enums";

export const Licence2 = () => {
    const dispatch = useAppDispatch();

    // Hooks pour la période et le filtrage des étudiants
    const { formattedPeriod, editableColumns, currentPeriodLabel } = useCurrentPeriod();
    const { activeSemester } = useAppSelector(state => state.semesters);
    const { teacherGrades } = useAppSelector(state => state.grades);
    const { notify } = useNotification();

    const user = useAppSelector((state) => state.user.profile);

    // Utiliser le hook corrigé pour filtrer les étudiants de niveau L2
    const {
        filteredStudents,
        teacherSubjectsForLevel,
        hasStudents,
        hasSubjects,
        studentCount
    } = useFilteredStudents({
        currentLevel: AcademicLevel.LEVEL2
    });

    // États locaux pour la gestion du tableau
    const [isTableEditable, setIsTableEditable] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [editedData, setEditedData] = useState<StudentDataResDto[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [showTable, setShowTable] = useState(false);

    usePageTitle(
        isTableEditable ? "Edition des notes de Licence 2" : "Notes Licence 2"
    );

    // Colonnes dynamiques selon la période
    const extraColumns: { title: string; dataIndex: string }[] = [];

    const [dataTable, setDataTable] = useState<StudentDataResDto[]>([]);

    // Sélectionner la première matière du niveau comme matière par défaut
    useEffect(() => {
        if (teacherSubjectsForLevel.length > 0 && !selectedSubject) {
            setSelectedSubject(teacherSubjectsForLevel[0]);
        }
    }, [teacherSubjectsForLevel, selectedSubject]);

    // Mettre à jour les données avec les étudiants filtrés
    useEffect(() => {
        if (filteredStudents.length > 0) {
            setDataTable(filteredStudents);
            setEditedData(filteredStudents);
        }
    }, [filteredStudents]);

    // Fonctions de gestion du tableau
    const handleEdit = () => {
        setEditedData(dataTable);
        setIsTableEditable(true);
    };

    const handleConfirm = async () => {
        try {
            if (!selectedSubject || !activeSemester) {
                notify({
                    type: "error",
                    message: "Erreur",
                    description: "Matière ou semestre non sélectionné"
                });
                return;
            }

            const currentDate = new Date().toISOString().split('T')[0];
            const gradesToSubmit: CreateGradeReqDto[] = [];

            for (const student of editedData) {
                // Parcourir les colonnes éditables pour créer les notes
                for (const gradeField of editableColumns) {
                    const gradeValue = (student as any)[gradeField];

                    if (gradeValue !== undefined && gradeValue !== null && gradeValue !== '') {
                        const numericValue = parseFloat(String(gradeValue));

                        if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 20) {
                            // Déterminer le type de note et le label de période
                            let gradeType: "ASSIGNMENT" | "EXAM" = "ASSIGNMENT";
                            let periodLabel = PeriodLabel.CC1;

                            switch (gradeField) {
                                case 'cc1':
                                    gradeType = "ASSIGNMENT";
                                    periodLabel = PeriodLabel.CC1;
                                    break;
                                case 'sn1':
                                    gradeType = "EXAM";
                                    periodLabel = PeriodLabel.SN1;
                                    break;
                                case 'cc2':
                                    gradeType = "ASSIGNMENT";
                                    periodLabel = PeriodLabel.CC2;
                                    break;
                                case 'sn2':
                                    gradeType = "EXAM";
                                    periodLabel = PeriodLabel.SN2;
                                    break;
                                default:
                                    gradeType = "ASSIGNMENT";
                                    periodLabel = PeriodLabel.CC1;
                            }

                            gradesToSubmit.push({
                                studentId: student.id,
                                subjectId: selectedSubject.id,
                                semesterId: activeSemester.id,
                                value: numericValue,
                                type: gradeType,
                                periodLabel: periodLabel,
                                comments: `Note ${gradeField.toUpperCase()} ajoutée le ${currentDate}`,
                                enteredBy: user?.id || 1
                            });
                        }
                    }
                }
            }

            if (gradesToSubmit.length === 0) {
                notify({
                    type: "warning",
                    message: "Attention",
                    description: "Aucune note valide à enregistrer"
                });
                return;
            }

            // Enregistrer toutes les notes
            await Promise.all(
                gradesToSubmit.map(gradeData =>
                    dispatch(createGrade(gradeData)).unwrap()
                )
            );

            setDataTable(editedData);
            setIsTableEditable(false);
            dispatch(fetchTeacherGrades());

            notify({
                type: "success",
                message: "Succès",
                description: `${gradesToSubmit.length} note(s) enregistrée(s) avec succès`
            });
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            notify({
                type: "error",
                message: "Erreur",
                description: `Erreur lors de l'enregistrement des notes: ${error}`
            });
        }
    };

    // Filtrer les données selon la recherche
    const filteredTableData = useMemo(() => {
        const base = isTableEditable ? editedData : dataTable;
        if (!searchValue.trim()) return base;

        return base.filter((student) =>
            `${student.firstName} ${student.lastName}`.toLowerCase()
                .includes(searchValue.toLowerCase())
        );
    }, [searchValue, dataTable, editedData, isTableEditable]);

    // Vérifier si au moins une note a été attribuée
    const gradeFields = ["cc1", "sn1", "cc2", "sn2"];
    const hasAtLeastOneGrade = filteredStudents.some(student =>
        gradeFields.some(field => {
            const value = (student as any)[field];
            return value !== undefined && value !== null && value !== '';
        })
    );

    // Charger les données initiales
    useEffect(() => {
        dispatch(fetchAssignedSubjects());
        dispatch(fetchTeacherGrades());
        dispatch(fetchStudents());
        dispatch(fetchActiveSemester());
    }, [dispatch]);

    // Afficher un message si l'enseignant n'enseigne pas à ce niveau
    if (!hasSubjects) {
        return (
            <div className="text-center py-8">
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                    Aucune matière assignée pour le niveau Licence 2
                </h2>
                <p className="text-gray-500">
                    Vous n'avez pas de matières assignées pour ce niveau.
                    Contactez l'administration pour vérifier vos assignations.
                </p>
            </div>
        );
    }

    return (
        <div>
            <GradesHeader
                title="L2"
                period={formattedPeriod}
                topic={selectedSubject?.name || teacherSubjectsForLevel[0]?.name || "Matière"}
                code={selectedSubject?.code || teacherSubjectsForLevel[0]?.code || "CODE"}
                level="Licence 2"
                NC="10"
                CANT="20"
            />

            <div className="mt-8">
                {hasStudents && (hasAtLeastOneGrade || showTable) ? (
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
                ) : hasStudents ? (
                    <EmptyGrade setShowTable={setShowTable} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">
                            Aucun étudiant de niveau Licence 2 ne suit vos cours.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            {studentCount === 0
                                ? "Aucun étudiant trouvé pour ce niveau."
                                : `${studentCount} étudiant(s) trouvé(s) mais aucun ne suit vos matières.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
