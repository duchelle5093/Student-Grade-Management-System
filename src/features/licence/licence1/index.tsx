import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { GradesHeader } from "../../../components/LicenceHeader";
import { EditableGradesTable } from "../../../components/EditableGradesTable";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useFilteredStudents, useCurrentPeriod } from "../../../hooks";
import { fetchStudents } from "../../user/actions";
import { fetchTeacherGrades, createGrade, updateGrade } from "../../grades";
import { fetchAssignedSubjects } from "../../subjects";
import { fetchActiveSemester } from "../../semesters";
import { AcademicLevel } from "../../../api/enums";
import { TeacherGradeResDto, CreateGradeReqDto, UpdateGradeReqDto } from "../../../api/reponse-dto/grade.res.dto";
import { useNotification } from "../../../contexts";

/** ------------------------------
 *  MOCKS si backend vide
 *  ------------------------------ */
const MOCK_ROWS = [
    { studentId: 1, studentName: "Dupont Jean",   cc1: 15, sn1: null, cc2: null, sn2: 18 },
    { studentId: 2, studentName: "Martin Sophie", cc1: 12, sn1: null, cc2: 16,   sn2: null },
    { studentId: 3, studentName: "Bernard Pierre",cc1: null, sn1: 14, cc2: null, sn2: null },
    { studentId: 4, studentName: "Petit Marie",   cc1: null, sn1: null,cc2: 10,  sn2: 11 },
];

export const Licence1 = () => {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const { activeSemester } = useAppSelector((s) => s.semesters);
    const { teacherGrades } = useAppSelector((s) => s.grades);
    const user = useAppSelector((s) => s.user.profile);

    const { formattedPeriod, editableColumns, currentPeriodLabel } = useCurrentPeriod();
    const { filteredStudents, teacherSubjectsForLevel } = useFilteredStudents({
        currentLevel: AcademicLevel.LEVEL1,
    });

    const [isTableEditable, setIsTableEditable] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [editedData, setEditedData] = useState<
        Array<{ studentId: number; studentName: string; cc1: number | null; sn1: number | null; cc2: number | null; sn2: number | null; }>
    >([]);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    usePageTitle(isTableEditable ? "Edition des notes de Licence 1" : "Notes Licence 1");

    // matière par défaut
    useEffect(() => {
        if (!selectedSubject && teacherSubjectsForLevel.length > 0) {
            setSelectedSubject(teacherSubjectsForLevel[0]);
        }
    }, [teacherSubjectsForLevel, selectedSubject]);

    /** Normalise "CC #1"/"SN #2" -> "cc1|sn1|cc2|sn2" */
    const toPeriodKey = (periodLabel?: string) => {
        if (!periodLabel) return null;
        const norm = periodLabel.toUpperCase().replace(/\s+/g, ""); // "CC#1"
        if (norm === "CC#1") return "cc1";
        if (norm === "SN#1") return "sn1";
        if (norm === "CC#2") return "cc2";
        if (norm === "SN#2") return "sn2";
        return null;
    };

    /** Fusion STUDENTS (liste complète) + GRADES (optionnelles) -> lignes pour le tableau */
    const mergedRows = useMemo(() => {
        const rowsFromBackend =
            filteredStudents.map((s) => {
                const sid = (s as any).studentId ?? (s as any).id;
                const name =
                    (s as any).studentName ??
                    ([s.firstName, s.lastName].filter(Boolean).join(" ") ||
                        (s as any).username ||
                        `Étudiant ${sid}`);

                const g = teacherGrades.filter((gr) => gr.studentId === sid);

                const map: Partial<Record<"cc1" | "sn1" | "cc2" | "sn2", number | null>> = {
                    cc1: null, sn1: null, cc2: null, sn2: null,
                };
                g.forEach((gr) => {
                    const key = toPeriodKey((gr as any).periodLabel);
                    if (key) map[key] = gr.value;
                });

                return {
                    studentId: sid,
                    studentName: name,
                    cc1: map.cc1 ?? null,
                    sn1: map.sn1 ?? null,
                    cc2: map.cc2 ?? null,
                    sn2: map.sn2 ?? null,
                };
            });

        const base = rowsFromBackend.length > 0 ? rowsFromBackend : MOCK_ROWS;

        if (!searchValue.trim()) return base;
        return base.filter((r) =>
            r.studentName.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [filteredStudents, teacherGrades, searchValue]);

    const handleEdit = () => {
        setEditedData(mergedRows);
        setIsTableEditable(true);
    };

    /** Transforme "CC #1" -> { periodBase: "CC", semesterId: 1 } */
    const parseCurrentPeriod = (label: string) => {
        if (!label) return { periodBase: "CC", semesterId: activeSemester?.id ?? 1 };

        const norm = label.toUpperCase().replace(/\s+/g, ""); // "CC#1"
        if (norm === "CC#1") return { periodBase: "CC", semesterId: 1 };
        if (norm === "SN#1") return { periodBase: "SN", semesterId: 1 };
        if (norm === "CC#2") return { periodBase: "CC", semesterId: 2 };
        if (norm === "SN#2") return { periodBase: "SN", semesterId: 2 };

        return { periodBase: "CC", semesterId: activeSemester?.id ?? 1 };
    };

    const handleConfirm = async () => {
        try {
            const { periodBase, semesterId } = parseCurrentPeriod(currentPeriodLabel);
            const key = (periodBase + (semesterId === 1 ? "1" : "2")).toLowerCase() as
                | "cc1" | "sn1" | "cc2" | "sn2";

            const payloads: Array<CreateGradeReqDto | ({ id: number } & UpdateGradeReqDto)> = [];

            for (const row of editedData) {
                const v = (row as any)[key];
                if (v === null || v === undefined || v === "") continue;
                const value = Number(v);
                if (Number.isNaN(value) || value < 0 || value > 20) continue;

                const existing: TeacherGradeResDto | undefined = teacherGrades.find(
                    (g) =>
                        g.studentId === row.studentId &&
                        g.semesterId === semesterId &&
                        (g.periodLabel?.replace(/\s+/g, "").toUpperCase() === (periodBase + "#" + semesterId))
                );

                if (existing) {
                    payloads.push({
                        id: existing.id,
                        value,
                        type: periodBase, // <-- "CC" ou "SN"
                        comments: `Note ${periodBase} ${semesterId} mise à jour`,
                    });
                } else {
                    payloads.push({
                        studentId: row.studentId,
                        subjectId: selectedSubject?.id || 1,
                        semesterId,
                        value,
                        type: periodBase, // <-- "CC" ou "SN"
                        periodLabel: currentPeriodLabel, // ex: "CC #1"
                        comments: `Note ${periodBase} ${semesterId} ajoutée`,
                        enteredBy: user?.id || 1,
                    });
                }
            }

            if (payloads.length === 0) {
                notify({ type: "warning", message: "Aucune note à enregistrer" });
                setIsTableEditable(false);
                return;
            }

            for (const p of payloads) {
                if ("id" in p) await dispatch(updateGrade(p)).unwrap();
                else await dispatch(createGrade(p)).unwrap();
            }

            await dispatch(fetchTeacherGrades());
            setIsTableEditable(false);

            notify({
                type: "success",
                message: "Succès",
                description: `${payloads.length} note(s) traitée(s)`,
            });
        } catch (e) {
            console.error(e);
            notify({
                type: "error",
                message: "Erreur",
                description: "Impossible d'enregistrer les notes",
            });
        }
    };

    useEffect(() => {
        dispatch(fetchAssignedSubjects());
        dispatch(fetchTeacherGrades());
        dispatch(fetchStudents());
        dispatch(fetchActiveSemester());
    }, [dispatch]);

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
                <EditableGradesTable
                    data={mergedRows}
                    isEditable={isTableEditable}
                    onGradesChange={setEditedData}
                    onEdit={handleEdit}
                    onConfirm={handleConfirm}
                    isDataEditable={isTableEditable}
                    setIsDataEditable={setIsTableEditable}
                    onSearch={setSearchValue}
                    editableColumns={editableColumns as any}
                />
            </div>
        </div>
    );
};
