import { useState, useEffect } from "react";
import { Table, Input, Button, Tag } from "antd";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import { GradesEdition } from "./GradesEditionBtn";
import { EditPvButton } from "./EditPvButton";
import { TeacherGradeResDto } from "../api/reponse-dto/grade.res.dto";

interface EditableGradesTableProps {
    extraColumns?: { title: string; dataIndex: string }[];
    isEditable: boolean;
    data: TeacherGradeResDto[];
    onGradesChange?: (data: TeacherGradeResDto[]) => void;
    onEdit: () => void;
    onConfirm: () => void;
    isDataEditable?: boolean;
    setIsDataEditable: (value: boolean) => void;
    onSearch?: (value: string) => void;
    editableColumns?: string[]; // ex: ["cc1", "sn1"]
}

export const EditableGradesTable = ({
                                        isEditable,
                                        data,
                                        onGradesChange,
                                        onEdit,
                                        onConfirm,
                                        setIsDataEditable,
                                        isDataEditable,
                                        onSearch,
                                        editableColumns = ["cc1"],
                                    }: EditableGradesTableProps) => {
    const [editingData, setEditingData] = useState<TeacherGradeResDto[]>(data);

    useEffect(() => {
        setEditingData(data);
    }, [data]);

    /** Mapping entre colonnes et labels backend */
    const periodMap: Record<string, "CC_1" | "SN_1" | "CC_2" | "SN_2"> = {
        cc1: "CC_1",
        sn1: "SN_1",
        cc2: "CC_2",
        sn2: "SN_2",
    };


    // ---- Obtenir une note ----
    const getStudentGrade = (
        studentId: number,
        field: "cc1" | "sn1" | "cc2" | "sn2"
    ) => {
        const grade = editingData.find(
            (g) => g.studentId === studentId && g.periodLabel === periodMap[field]
        );
        return grade?.value ?? null;
    };

    // ---- Mettre à jour une note ----
    const updateStudentGrade = (
        studentId: number,
        field: string,
        value: string
    ) => {
        const periodLabel = periodMap[field as keyof typeof periodMap];
        const numericValue = value ? parseFloat(value) : null;

        // Vérifie si la note existe déjà
        const existing = editingData.find(
            (g) => g.studentId === studentId && g.periodLabel === periodLabel
        );

        const updatedGrade = {
            ...(existing || {}),
            studentId,
            periodLabel,
            value: numericValue,
        };

        // Retirer l’ancienne valeur si elle existait
        const newData = editingData.filter(
            (g) => !(g.studentId === studentId && g.periodLabel === periodLabel)
        );

        // Ajouter la nouvelle valeur si non vide
        if (numericValue !== null) {
            newData.push(updatedGrade as TeacherGradeResDto);
        }

        setEditingData(newData);
        onGradesChange?.(newData);
    };

    // ---- Colonnes du tableau ----
    const columns = [
        {
            title: "Matricule",
            dataIndex: "studentId",
            key: "studentId",
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                Number(a.studentId) - Number(b.studentId),
        },
        {
            title: "Noms et prénoms",
            dataIndex: "studentName",
            key: "studentName",
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                String(a.studentName || "").localeCompare(String(b.studentName || "")),
        },
        ...["cc1", "sn1", "cc2", "sn2"].map((field) => ({
            title: (
                    <div>{field.toUpperCase()}</div>
            ),
            key: field,
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) => {
                const gradeA = getStudentGrade(a.studentId, field as any) || 0;
                const gradeB = getStudentGrade(b.studentId, field as any) || 0;
                return gradeA - gradeB;
            },
            render: (_: any, record: TeacherGradeResDto) => {
                const grade = getStudentGrade(record.studentId, field as any);
                return isEditable && editableColumns.includes(field) ? (
                    <Input
                        type="number"
                        min={0}
                        max={30}
                        value={grade ?? ""}
                        onChange={(e) =>
                            updateStudentGrade(record.studentId, field, e.target.value)
                        }
                    />
                ) : (
                    grade?.toString() || "-"
                );
            },
        })),
        {
            title: "Total",
            key: "total",
            render: (_: any, record: TeacherGradeResDto) => {
                const total =
                    (getStudentGrade(record.studentId, "cc1") || 0) +
                    (getStudentGrade(record.studentId, "sn1") || 0) +
                    (getStudentGrade(record.studentId, "cc2") || 0) +
                    (getStudentGrade(record.studentId, "sn2") || 0);
                return total > 0 ? total.toFixed(2) : "-";
            },
        },
    ];

    // ---- Stats ----
    const studentsWithGrades = new Set<number>();
    editingData.forEach((g) => {
        if (g.value !== null && g.value !== undefined) {
            studentsWithGrades.add(g.studentId);
        }
    });

    const attributedGrades = studentsWithGrades.size;
    const totalStudents = data.length;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch?.(e.target.value);
    };

    return (
        <div>
            <div className="md:flex justify-between mt-4 mb-2 w-full">
                <div className="flex md:w-3/4">
                    <Button
                        icon={<MagnifyingGlassCircleIcon width={24} />}
                        className="!text-white"
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        Rechercher
                    </Button>
                    <Input
                        placeholder="Entrez le nom ..."
                        onChange={handleSearch}
                        allowClear
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    />
                </div>
                <div className="flex items-center justify-center mt-5 md:mt-0">
                    {isDataEditable ? (
                        <GradesEdition
                            editGrades={() => {
                                setEditingData(data);
                                onEdit();
                            }}
                            confirmGrades={() => {
                                onConfirm();
                                setIsDataEditable(false);
                            }}
                            setIsTableEditable={setIsDataEditable}
                        />
                    ) : (
                        <EditPvButton
                            setIsTableEditable={setIsDataEditable}
                            onEdit={onEdit}
                        />
                    )}
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="studentId"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
            />
            <div className="flex justify-between mt-4 w-full">
                <Tag
                    color={attributedGrades < totalStudents ? "orange" : "green"}
                    className="!h-9 !flex !items-center !justify-center !font-bold"
                >
                    {attributedGrades} notes attribuées pour {totalStudents} étudiants
                </Tag>
            </div>
        </div>
    );
};
