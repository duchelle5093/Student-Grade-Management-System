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
import {CreateGradeReqDto, TeacherGradeResDto} from "../../../api/reponse-dto/grade.res.dto.ts";
import { useNotification } from "../../../contexts";
import { fetchActiveSemester } from "../../semesters";
import { AcademicLevel, PeriodLabel } from "../../../api/enums";
import { mockStudents, mockSubject } from "../mockData";

// Variable pour activer/désactiver le mode test
const USE_MOCK_DATA = true;

export const Licence1 = () => {
    const dispatch = useAppDispatch();

    // Hooks pour la période et le filtrage des étudiants
    const { formattedPeriod, editableColumns, currentPeriodLabel } = useCurrentPeriod();
    const { activeSemester } = useAppSelector(state => state.semesters);
    const { teacherGrades } = useAppSelector(state => state.grades);
    const { notify } = useNotification();

    const user = useAppSelector((state) => state.user.profile);

    // Utiliser le hook corrigé pour filtrer les étudiants de niveau L1
    const {
        filteredStudents,
        teacherSubjectsForLevel,
        hasStudents,
        studentCount
    } = useFilteredStudents({
        currentLevel: AcademicLevel.LEVEL1
    });

    // États locaux pour la gestion du tableau
    const [isTableEditable, setIsTableEditable] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [editedData, setEditedData] = useState<TeacherGradeResDto[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [showTable, setShowTable] = useState(false);

    usePageTitle(
        isTableEditable ? "Edition des notes de Licence 1" : "Notes Licence 1"
    );

    // Colonnes dynamiques selon la période
    const extraColumns: { title: string; dataIndex: string }[] = [];

    const [dataTable, setDataTable] = useState<TeacherGradeResDto[]>([]);

    // Sélectionner la première matière du niveau comme matière par défaut
    useEffect(() => {
        if (USE_MOCK_DATA && !selectedSubject) {
            setSelectedSubject(mockSubject);
        } else if (teacherSubjectsForLevel.length > 0 && !selectedSubject) {
            setSelectedSubject(teacherSubjectsForLevel[0]);
        }
    }, [teacherSubjectsForLevel, selectedSubject]);

    // Mettre à jour les données avec les étudiants filtrés ou les données de test
    useEffect(() => {
        if (USE_MOCK_DATA) {
            // Utiliser les données de test
            setDataTable(mockStudents);
            setEditedData(mockStudents);
            // Définir la matière de test si aucune n'est sélectionnée
            if (!selectedSubject) {
                setSelectedSubject(mockSubject);
            }
        } else if (filteredStudents.length > 0) {
            // Utiliser les données de l'API
            setDataTable(filteredStudents);
            setEditedData(filteredStudents);
        }
    }, [filteredStudents, selectedSubject]);

    // Fonctions de gestion du tableau
    const handleEdit = () => {
        setEditedData(dataTable);
        setIsTableEditable(true);
    };

    const handleConfirm = async () => {
        console.log('=== DEBUT handleConfirm ===');
        console.log('1. Données éditées:', editedData);
        console.log('2. Colonnes éditables:', editableColumns);
        console.log('3. Matière sélectionnée:', selectedSubject);
        console.log('4. Semestre actif:', activeSemester);
        
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const gradesToSubmit: CreateGradeReqDto[] = [];
            
            console.log('5. Période actuelle:', currentPeriodLabel);

            // 1. Préparer les données à envoyer
            console.log('6. Données complètes des étudiants:', JSON.stringify(editedData, null, 2));
            
            // Déterminer le type de note (CC ou SN) et le numéro de session
            const periodType = currentPeriodLabel.startsWith('CC') ? 'cc' : 'sn';
            const periodNumber = currentPeriodLabel.replace(/\D/g, ''); // Extrait le numéro (1 ou 2)
            const gradeField = `${periodType}${periodNumber}`.toLowerCase(); // cc1, sn1, cc2 ou sn2
            
            console.log(`7. Recherche des notes pour le champ: ${gradeField}`);
            
            for (const student of editedData) {
                // Vérifier si l'étudiant a une note pour cette période
                const hasGradeForPeriod = student.periodLabel === currentPeriodLabel;
                const gradeValue = hasGradeForPeriod ? student.value : undefined;
                
                console.log(`8. Étudiant ${student.studentId || student.id} - ${student.studentName || 'Sans nom'}, ` +
                           `période ${currentPeriodLabel}:`, gradeValue);

                if (gradeValue !== undefined && gradeValue !== null && gradeValue !== '') {
                    const numericValue = typeof gradeValue === 'string' ? parseFloat(gradeValue) : Number(gradeValue);
                    console.log(`9. Valeur numérique traitée:`, numericValue);
                    
                    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 20) {
                        const gradeData = {
                            studentId: student.studentId || student.id,
                            subjectId: selectedSubject?.id || student.subjectId || 1,
                            semesterId: activeSemester?.id || student.semesterId || 1,
                            value: numericValue,
                            type: currentPeriodLabel.startsWith('CC') ? 'ASSIGNMENT' : 'EXAM',
                            periodLabel: currentPeriodLabel,
                            comments: `Note ${currentPeriodLabel} ajoutée le ${currentDate}`,
                            enteredBy: user?.id || 1
                        };
                        console.log('10. Données de la note à envoyer:', gradeData);
                        gradesToSubmit.push(gradeData);
                    }
                }
            }

            if (gradesToSubmit.length === 0) {
                throw new Error("Aucune note valide à enregistrer");
            }

            console.log('7. Notes à soumettre:', gradesToSubmit);
            
            if (gradesToSubmit.length === 0) {
                console.warn('8. Aucune note valide à enregistrer');
                throw new Error("Aucune note valide à enregistrer");
            }

            // 2. Envoyer les notes une par une
            const results = [];
            console.log('9. Début de l\'envoi des notes...');
            for (const gradeData of gradesToSubmit) {
                try {
                    console.log('Envoi de la note:', gradeData);
                    const result = await dispatch(createGrade(gradeData)).unwrap();
                    results.push(result);
                } catch (error) {
                    console.error('Erreur lors de l\'envoi d\'une note:', error);
                    throw error;
                }
            }

            // 3. Mettre à jour l'interface utilisateur
            setDataTable(editedData);
            setIsTableEditable(false);
            
            // 4. Rafraîchir les données du serveur
            await dispatch(fetchTeacherGrades());
            
            console.log('10. Toutes les notes ont été envoyées avec succès');
            
            // 5. Afficher le message de succès
            notify({
                type: "success",
                message: "Succès",
                description: `${results.length} note(s) enregistrée(s) avec succès`
            });

        } catch (error) {
            console.error('11. ERREUR dans handleConfirm:', error);

        }
    };

    // Filtrer les données selon la recherche
    const filteredTableData = useMemo(() => {
        const base = isTableEditable ? editedData : dataTable;
        if (!searchValue.trim()) return base;

        return base.filter((student) =>
            `${student.studentName} `.toLowerCase()
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
    // if (!hasSubjects) {
    //     return (
    //         <div className="text-center py-8">
    //             <h2 className="text-xl font-semibold text-gray-600 mb-4">
    //                 Aucune matière assignée pour le niveau Licence 1
    //             </h2>
    //             <p className="text-gray-500">
    //                 Vous n'avez pas de matières assignées pour ce niveau.
    //                 Contactez l'administration pour vérifier vos assignations.
    //             </p>
    //         </div>
    //     );
    // }

    return (
        <div>
            <GradesHeader
                title="L1"
                period={formattedPeriod}
                topic={selectedSubject?.name || teacherSubjectsForLevel[0]?.name || "Matière"}
                code={selectedSubject?.code || teacherSubjectsForLevel[0]?.code || "CODE"}
                level="Licence 1"
                NC="10"
                CANT="10"
            />

            <div className="mt-8">
                {/*{(hasAtLeastOneGrade || showTable) ? (*/}
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
                {/*) : hasAtLeastOneGrade ? (*/}
                {/*    <EmptyGrade setShowTable={setShowTable} />*/}
                {/*) : (*/}
                {/*    <div className="text-center py-8">*/}
                {/*        <p className="text-gray-500 text-lg">*/}
                {/*            Aucun étudiant de niveau Licence 1 ne suit vos cours.*/}
                {/*        </p>*/}
                {/*        <p className="text-gray-400 text-sm mt-2">*/}
                {/*            {studentCount === 0*/}
                {/*                ? "Aucun étudiant trouvé pour ce niveau."*/}
                {/*                : `${studentCount} étudiant(s) trouvé(s) mais aucun ne suit vos matières.`*/}
                {/*            }*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </div>
    );
};
