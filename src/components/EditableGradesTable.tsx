import {useState, useEffect, useMemo} from "react";
import { Table, Input, Button, Tag } from "antd";
import {
    MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
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
    editableColumns?: string[]; // Colonnes éditables selon la période (cc1, sn1, cc2, sn2)
}

export const EditableGradesTable = ({
                                        extraColumns = [],
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

    // Synchroniser les données d'édition avec les props
    useEffect(() => {
        setEditingData(data);
    }, [data]);

    // Fonction utilitaire pour obtenir les étudiants uniques
    const getUniqueStudents = (grades: TeacherGradeResDto[]) => {
        const uniqueStudents = new Map<number, TeacherGradeResDto>();
        grades.forEach(grade => {
            if (!uniqueStudents.has(grade.studentId)) {
                uniqueStudents.set(grade.studentId, {
                    ...grade,
                    studentName: grade.studentName || `Étudiant ${grade.studentId}`
                });
            }
        });
        return Array.from(uniqueStudents.values());
    };

    // Obtenir la liste des étudiants uniques
    const uniqueStudents = useMemo(() => getUniqueStudents(editingData), [editingData]);

    // Données à afficher (utilisé pour le filtrage de recherche)
    const displayData = uniqueStudents || [];

    // Fonction utilitaire pour obtenir une note spécifique d'un étudiant
    const getStudentGrade = (studentId: number, period: 'cc1' | 'sn1' | 'cc2' | 'sn2') => {
        const periodMap = {
            'cc1': 'CC1',
            'sn1': 'SN1',
            'cc2': 'CC2',
            'sn2': 'SN2'
        };

        const grade = editingData.find(g =>
            g.studentId === studentId &&
            g.periodLabel === periodMap[period]
        );

        return grade?.value !== undefined ? grade.value : null;
    };

    // Fonction pour mettre à jour une note d'étudiant
    const updateStudentGrade = (studentId: number, field: string, value: string) => {
        const periodMap = {
            'cc1': 'CC1',
            'sn1': 'SN1',
            'cc2': 'CC2',
            'sn2': 'SN2'
        };

        const periodLabel = periodMap[field as keyof typeof periodMap] || field;
        const numericValue = value ? parseFloat(value) : null;

        // Créer un nouvel objet de note
        const updatedGrade = {
            ...editingData.find(g => g.studentId === studentId && g.periodLabel === periodLabel),
            studentId,
            periodLabel,
            value: numericValue
        };

        // Mettre à jour les données d'édition
        const newData = editingData.filter(
            g => !(g.studentId === studentId && g.periodLabel === periodLabel)
        );

        if (numericValue !== null) {
            newData.push(updatedGrade);
        }

        setEditingData(newData);
        onGradesChange?.(newData);
    };

    // Colonnes de base du tableau
    const columns = [
        {
            title: "Matricule",
            dataIndex: "id",
            key: "id",
            render: (text: number) => text,
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                Number(a.studentId) - Number(b.studentId),
        },
        {
            title: "Noms et prénoms",
            dataIndex: "studentName",
            key: "studentName",
            render: (text: any, record: TeacherGradeResDto) =>
                record.studentName,
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                String(a.studentName || '').localeCompare(String(b.studentName || '')),
        },
        {
            title: "CC#1",
            dataIndex: "value",
            key: "cc1",
            render: (text: any, record: TeacherGradeResDto) => {
                const grade = getStudentGrade(record.studentId, 'cc1');
                return isEditable && editableColumns.includes("cc1") ? (
                    <Input
                        type="number"
                        min={0}
                        max={20}
                        value={grade ?? ''}
                        onChange={(e) => updateStudentGrade(record.studentId, "cc1", e.target.value)}
                        placeholder="0-20"
                    />
                ) : (
                    grade?.toString() || "-"
                );
            },
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                (getStudentGrade(a.studentId, 'cc1') || 0) - (getStudentGrade(b.studentId, 'cc1') || 0),
        },
        {
            title: "SN#1",
            dataIndex: "value",
            key: "sn1",
            render: (text: any, record: TeacherGradeResDto) => {
                const grade = getStudentGrade(record.studentId, 'sn1');
                return isEditable && editableColumns.includes("sn1") ? (
                    <Input
                        type="number"
                        min={0}
                        max={20}
                        value={grade ?? ''}
                        onChange={(e) => updateStudentGrade(record.studentId, "sn1", e.target.value)}
                        placeholder="0-20"
                    />
                ) : (
                    grade?.toString() || "-"
                );
            },
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                (getStudentGrade(a.studentId, 'sn1') || 0) - (getStudentGrade(b.studentId, 'sn1') || 0),
        },
        {
            title: "CC#2",
            dataIndex: "value",
            key: "cc2",
            render: (text: any, record: TeacherGradeResDto) => {
                const grade = getStudentGrade(record.studentId, 'cc2');
                return isEditable && editableColumns.includes("cc2") ? (
                    <Input
                        type="number"
                        min={0}
                        max={20}
                        value={grade ?? ''}
                        onChange={(e) => updateStudentGrade(record.studentId, "cc2", e.target.value)}
                        placeholder="0-20"
                    />
                ) : (
                    grade?.toString() || "-"
                );
            },
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                (getStudentGrade(a.studentId, 'cc2') || 0) - (getStudentGrade(b.studentId, 'cc2') || 0),
        },
        {
            title: "SN#2",
            dataIndex: "value",
            key: "sn2",
            render: (text: any, record: TeacherGradeResDto) => {
                const grade = getStudentGrade(record.studentId, 'sn2');
                return isEditable && editableColumns.includes("sn2") ? (
                    <Input
                        type="number"
                        min={0}
                        max={20}
                        value={grade ?? ''}
                        onChange={(e) => updateStudentGrade(record.studentId, "sn2", e.target.value)}
                        placeholder="0-20"
                    />
                ) : (
                    grade?.toString() || "-"
                );
            },
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) =>
                (getStudentGrade(a.studentId, 'sn2') || 0) - (getStudentGrade(b.studentId, 'sn2') || 0),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (_: any, record: TeacherGradeResDto) => {
                // Calculer le total des notes disponibles
                const cc1 = getStudentGrade(record.studentId, 'cc1') || 0;
                const sn1 = getStudentGrade(record.studentId, 'sn1') || 0;
                const cc2 = getStudentGrade(record.studentId, 'cc2') || 0;
                const sn2 = getStudentGrade(record.studentId, 'sn2') || 0;

                const total = cc1 + sn1 + cc2 + sn2;
                return total > 0 ? total.toFixed(2) : "-";
            },
            sorter: (a: TeacherGradeResDto, b: TeacherGradeResDto) => {
                const getTotal = (studentId: number) => {
                    return (getStudentGrade(studentId, 'cc1') || 0) +
                        (getStudentGrade(studentId, 'sn1') || 0) +
                        (getStudentGrade(studentId, 'cc2') || 0) +
                        (getStudentGrade(studentId, 'sn2') || 0);
                };
                return getTotal(a.studentId) - getTotal(b.studentId);
            },
        },
    ];



    // Calculer les statistiques
    const studentsWithGrades = new Set<number>();

    // Parcourir toutes les notes et ajouter les étudiants qui ont au moins une note
    editingData.forEach(grade => {
        if (grade.value !== null && grade.value !== undefined) {
            studentsWithGrades.add(grade.studentId);
        }
    });

    const attributedGrades = studentsWithGrades.size;
    const totalStudents = displayData.length;

    const tagColor = () => {
        if (attributedGrades < totalStudents) {
            return "orange";
        } else {
            return "green";
        }
    };

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
                                // Réinitialiser l'édition
                                setEditingData(data);
                                onEdit();
                            }}
                            confirmGrades={() => {
                                // Envoyer les données mises à jour
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
                dataSource={displayData}
                rowKey="studentId"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                }}
                scroll={{ x: true }}
            />
            <div className="flex justify-between mt-4 w-full">
                <div>
                    <Tag
                        color={tagColor()}
                        className="!h-9 !flex !items-center !justify-center !font-bold"
                    >
                        {attributedGrades} notes attribuées pour {totalStudents} étudiants
                    </Tag>
                </div>
            </div>
        </div>
    );
};
