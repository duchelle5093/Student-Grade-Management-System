import { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Modal, Badge } from "antd";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { GradesEdition } from "./GradesEditionBtn";
import { EditPvButton } from "./EditPvButton";
import { ReclamationsDetails } from "../features/reclamations";
import { ClaimData } from "../features/teacher/mockClaimsData";
import { gradeService } from "../api/configs";
import { useNotification } from "../contexts";
import { useActivePeriodPolling, useClaims } from "../hooks";
import { getMaxGradeValue } from "../utils/periodUtils";

// Interface pour les données d'affichage du tableau
interface StudentGradeRow {
    studentId: number;
    studentName: string;
    cc1: number | null;
    sn1: number | null;
    cc2: number | null;
    sn2: number | null;
}



interface TeacherGradesTableProps {
    isEditable: boolean;
    data: StudentGradeRow[];
    studentsWithClaims?: any[];
    onGradesChange?: (data: StudentGradeRow[]) => void;
    onEdit: () => void;
    onConfirm: () => void;
    isDataEditable?: boolean;
    setIsDataEditable: (value: boolean) => void;
    onSearch?: (value: string) => void;
    currentSubjectId?: number; // Ajout pour filtrer les réclamations
}

export const TeacherGradesTable = ({
    isEditable,
    data,
    studentsWithClaims = [],
    onGradesChange,
    onEdit,
    onConfirm,
    setIsDataEditable,
    isDataEditable,
    onSearch,
    currentSubjectId,

}: TeacherGradesTableProps) => {
    const [editingData, setEditingData] = useState<StudentGradeRow[]>(data);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);

    const [rejectReason, setRejectReason] = useState("");
    const { notify } = useNotification();
    
    // Polling des colonnes éditables basé sur la période active
    const { editableColumns: pollingEditableColumns } = useActivePeriodPolling({
        enabled: true,
        interval: 60000 // 1 minute - optimisé
    });
    
    // Hook pour gérer les réclamations via API
    const { getClaimsForStudent, getPendingClaimsCount, refreshClaims } = useClaims(currentSubjectId);
    


    useEffect(() => {
        setEditingData(data);
    }, [data]);





    const getStudentGrade = (studentId: number, field: "cc1" | "sn1" | "cc2" | "sn2") => {
        const student = editingData.find(s => s.studentId === studentId);
        return student?.[field] ?? null;
    };

    const updateStudentGrade = (studentId: number, field: string, value: string) => {
        const numericValue = value ? parseFloat(value) : null;

        const newData = editingData.map(student => {
            if (student.studentId === studentId) {
                return {
                    ...student,
                    [field]: numericValue
                };
            }
            return student;
        });

        setEditingData(newData);
        onGradesChange?.(newData);
    };

    const handleClaimClick = (studentId: number, period: "cc1" | "sn1" | "cc2" | "sn2") => {
        const claims = getClaimsForStudent(studentId, period);
        
        if (claims.length > 0) {
            // Transformer la réclamation API en format attendu par la modal
            const apiClaim = claims[0];
            const transformedClaim = {
                id: apiClaim.id.toString(),
                period: period,
                requestedScore: apiClaim.requestedScore,
                cause: apiClaim.cause,
                description: apiClaim.description
            };
            setSelectedClaim(transformedClaim);
            setIsClaimModalOpen(true);
        }
    };

    const handleApproveClaim = async () => {
        if (!selectedClaim) return;

        try {
            await gradeService.processGradeClaim(parseInt(selectedClaim.id), { approve: true });
            
            // Refresh multiple stores pour synchronisation complète
            await Promise.all([
                refreshClaims(),
                // Pas besoin de recharger les notes car elles ne changent pas lors de l'approbation
            ]);
            
            notify({
                type: 'success',
                message: 'Revendication approuvée',
                description: 'La note a été mise à jour'
            });
            setIsClaimModalOpen(false);
            setSelectedClaim(null);
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur',
                description: 'Impossible d\'approuver la revendication'
            });
        }
    };

    const handleRejectClaim = async () => {
        if (!selectedClaim || !rejectReason.trim()) return;

        try {
            await gradeService.processGradeClaim(parseInt(selectedClaim.id), { approve: false, comment: rejectReason });
            notify({
                type: 'success',
                message: 'Revendication rejetée',
                description: 'L\'étudiant a été notifié'
            });
            await refreshClaims(); // Actualiser les réclamations
            setIsClaimModalOpen(false);
            setSelectedClaim(null);
            setRejectReason("");
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur',
                description: 'Impossible de rejeter la revendication'
            });
        }
    };

    const columns = [
        {
            title: "Matricule",
            dataIndex: "studentId",
            key: "studentId",
            sorter: (a: StudentGradeRow, b: StudentGradeRow) =>
                Number(a.studentId) - Number(b.studentId),
        },
        {
            title: "Noms et prénoms",
            dataIndex: "studentName",
            key: "studentName",
            sorter: (a: StudentGradeRow, b: StudentGradeRow) =>
                String(a.studentName || "").localeCompare(String(b.studentName || "")),
        },
        ...["cc1", "sn1", "cc2", "sn2"].map((field) => ({
            title: <div>{field.toUpperCase()}</div>,
            key: field,
            sorter: (a: StudentGradeRow, b: StudentGradeRow) => {
                const gradeA = getStudentGrade(a.studentId, field as any) || 0;
                const gradeB = getStudentGrade(b.studentId, field as any) || 0;
                return gradeA - gradeB;
            },
            render: (_: any, record: StudentGradeRow) => {
                if (!record || !record.studentId) return "-";
                
                const grade = getStudentGrade(record.studentId, field as any);
                const claims = getClaimsForStudent(record.studentId, field as any);
                const hasClaim = claims.length > 0;

                // Seul le polling détermine les colonnes éditables
                const currentEditableColumns = Array.isArray(pollingEditableColumns) ? pollingEditableColumns : [];
                
                if (isEditable && currentEditableColumns.includes(field)) {
                    const periodMap: Record<string, string> = {
                        cc1: "CC_1", sn1: "SN_1", cc2: "CC_2", sn2: "SN_2"
                    };
                    const maxValue = getMaxGradeValue(periodMap[field]);
                    
                    return (
                        <Input
                            key={`${record.studentId}-${field}`}
                            type="number"
                            min={0}
                            max={maxValue}
                            value={grade ?? ""}
                            onChange={(e) =>
                                updateStudentGrade(record.studentId, field, e.target.value)
                            }
                            className={hasClaim ? "border-orange-400 bg-orange-50" : ""}
                            placeholder={`Max: ${maxValue}`}
                        />
                    );
                }

                if (hasClaim) {
                    return (
                        <div
                            key={`${record.studentId}-${field}-claim`}
                            className="cursor-pointer bg-orange-100 border-2 border-orange-400 rounded px-2 py-1 hover:bg-orange-200 transition-colors"
                            onClick={() => handleClaimClick(record.studentId, field as any)}
                        >
                            <Badge count={1} size="small" style={{ backgroundColor: '#ff7875' }}>
                                <span className="font-medium">{grade?.toString() || "-"}</span>
                            </Badge>
                            <ExclamationCircleOutlined className="ml-1 text-orange-500" />
                        </div>
                    );
                }

                return <span key={`${record.studentId}-${field}-grade`}>{grade?.toString() || "-"}</span>;
            },
        })),
        {
            title: "Total",
            key: "total",
            render: (_: any, record: StudentGradeRow) => {
                if (!record || !record.studentId) return "-";
                
                const grades = ["cc1", "sn1", "cc2", "sn2"].map(field => 
                    getStudentGrade(record.studentId, field as any) || 0
                );
                const total = grades.reduce((sum, grade) => sum + grade, 0);
                return <span key={`${record.studentId}-total`}>{total > 0 ? total.toFixed(2) : "-"}</span>;
            },
        },
    ];

    const studentsWithGrades = new Set<number>();
    editingData.forEach((student) => {
        const hasAnyGrade = [student.cc1, student.sn1, student.cc2, student.sn2]
            .some(grade => grade !== null && grade !== undefined);
        if (hasAnyGrade) {
            studentsWithGrades.add(student.studentId);
        }
    });

    const attributedGrades = studentsWithGrades.size;
    const totalStudents = data.length;
    const totalPendingClaims = getPendingClaimsCount();

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

            {totalPendingClaims > 0 && (
                <div className="mb-4">
                    <Tag color="orange" className="!h-9 !flex !items-center !justify-center !font-bold">
                        <ExclamationCircleOutlined className="mr-1" />
                        {totalPendingClaims} revendication(s) en attente
                    </Tag>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={data}
                rowKey="studentId"
                pagination={{ 
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    responsive: true
                }}
                scroll={{ x: 800 }}
                size="small"
            />

            <div className="flex justify-between mt-4 w-full">
                <Tag
                    color={attributedGrades < totalStudents ? "orange" : "green"}
                    className="!h-9 !flex !items-center !justify-center !font-bold"
                >
                    {attributedGrades} notes attribuées pour {totalStudents} étudiants
                </Tag>
            </div>

            <Modal
                title="Traitement de la revendication"
                open={isClaimModalOpen}
                onCancel={() => {
                    setIsClaimModalOpen(false);
                    setSelectedClaim(null);
                    setRejectReason("");
                }}
                footer={null}
                width={600}
            >
                {selectedClaim && (
                    <ReclamationsDetails
                        student={{} as any}
                        currentTopic={{} as any}
                        formValues={{
                            period: selectedClaim.period,
                            requestedScore: selectedClaim.requestedScore,
                            cause: selectedClaim.cause,
                            description: selectedClaim.description
                        }}
                        handleOk={() => {}}
                        handleCancel={() => {}}
                        hasClaimed={() => false}
                        isTeacherView={true}
                        onApprove={handleApproveClaim}
                        onReject={handleRejectClaim}
                        rejectReason={rejectReason}
                        onRejectReasonChange={setRejectReason}
                    />
                )}
            </Modal>
        </div>
    );
};