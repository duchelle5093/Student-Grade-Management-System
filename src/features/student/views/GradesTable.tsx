import { Table, Button, Modal,Tag } from "antd";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { useState, useMemo } from "react";
import Reclamations from "../../reclamations/Reclamations.tsx";
import { useNotification } from "../../../contexts";
import {ReclamationsDetails} from "../../reclamations";
import {StudentDataResDto, StudentGradeResDto, StudentTopicResDto} from "../../../api/reponse-dto/student.res.dto.ts";
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { PDFDocument } from '../../../components/PDFDocument';

interface GradesTableProps {
  student: StudentDataResDto;
}

export interface ReclamationValuesProps {
    period: string;
    requestedScore: number;
    cause: string;
    description: string;
}

export default function GradesTable({ student }: GradesTableProps) {
  const initialReclamationsValues:ReclamationValuesProps = {
    period: '',
    requestedScore: 0,
    cause: '',
    description: '',
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<StudentTopicResDto | null>(null);
  const [formValues, setFormValues] = useState(initialReclamationsValues);
  const [claimedTopics, setClaimedTopics] = useState<Set<string>>(new Set());
  const {notify} = useNotification()

  // Regrouper les notes par matière
  const groupedGrades = useMemo(() => {
    if (!student?.grades?.length) return [];
    
    const grouped = student.grades.reduce((acc, grade) => {
      const key = grade.subjectCode;
      if (!acc[key]) {
        acc[key] = {
          subjectCode: grade.subjectCode,
          subjectName: grade.subjectName,
          semesterName: grade.semesterName,
          creditsEarned: grade.creditsEarned,
          cc: null as number | null,
          sn: null as number | null,
          total: 0,
          passed: false
        };
      }
      
      // Gérer les periodLabel selon le semestre
      if (grade.periodLabel === 'CC_1' || grade.periodLabel === 'CC_2') {
        acc[key].cc = grade.value;
      } else if (grade.periodLabel === 'SN_1' || grade.periodLabel === 'SN_2') {
        acc[key].sn = grade.value;
      }
      
      // Calculer le total et le statut
      const cc = acc[key].cc || 0;
      const sn = acc[key].sn || 0;
      acc[key].total = cc + sn;
      acc[key].passed = acc[key].total >= 50;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped);
  }, [student?.grades]);

  const showModal = (topic: StudentTopicResDto) => {
    setCurrentTopic(topic);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentTopic) {
      setClaimedTopics(prev => new Set([...prev, currentTopic.code]));
      notify({
        type:'success',
        message:"Succes",
        description: `Revendication envoyée pour la matière ${currentTopic.title}`
      });
      setFormValues(initialReclamationsValues);
      setIsModalVisible(false);
      setCurrentTopic(null);
    }
  };

  const handleClaimSuccess = () => {
    if (currentTopic) {
      setClaimedTopics(prev => new Set([...prev, currentTopic.code]));
      notify({
        type:'success',
        message:"Succes",
        description: `Revendication envoyée pour la matière ${currentTopic.title}`
      });
      setFormValues(initialReclamationsValues);
      setIsModalVisible(false);
      setCurrentTopic(null);
    }
  };

  const handleFormSubmit = (values: any) => {
    setFormValues({
      period: values.period,
      requestedScore: values.requestedScore,
      cause: values.cause,
      description: values.description
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTopic(null);
  };

  const handlePrintTranscript = async () => {
    if (!student?.grades?.length) {
      notify({
        type: 'warning',
        message: 'Aucune note',
        description: 'Aucune note disponible pour générer le relevé'
      });
      return;
    }

    try {
      const studentData = {
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        username: student.username || student.studentId?.toString() || '',
        email: student.email || '',
        level: student.level || ''
      };

      const grades = groupedGrades.map(grade => ({
        subjectCode: grade.subjectCode,
        subjectName: grade.subjectName,
        creditsEarned: grade.creditsEarned,
        value: grade.total,
        semesterName: grade.semesterName,
        periodLabel: 'Total',
        passed: grade.passed
      }));

      const doc = PDFDocument({ studentData, grades });
      const blob = await pdf(doc).toBlob();
      
      const filename = `releve_notes_${student.firstName}_${student.lastName}_${Date.now()}.pdf`;
      saveAs(blob, filename);
      
      notify({
        type: 'success',
        message: 'Relevé généré',
        description: 'Votre relevé de notes a été téléchargé avec succès'
      });
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      notify({
        type: 'error',
        message: 'Erreur',
        description: 'Impossible de générer le relevé de notes'
      });
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      sorter: (a: any, b: any) => (a.subjectCode || '').localeCompare(b.subjectCode || ''),
    },
    {
      title: "Intitulé de la matière",
      dataIndex: "subjectName",
      key: "subjectName",
      sorter: (a: any, b: any) => (a.subjectName || '').localeCompare(b.subjectName || ''),
    },
    {
      title: "Semestre",
      dataIndex: "semesterName",
      key: "semesterName",
      sorter: (a: any, b: any) => (a.semesterName || '').localeCompare(b.semesterName || ''),
    },
    {
      title: "CC/30",
      dataIndex: "cc",
      key: "cc",
      render: (cc: number | null) => cc !== null ? cc : "-",
      sorter: (a: any, b: any) => (a.cc || 0) - (b.cc || 0),
    },
    {
      title: "SN/70",
      dataIndex: "sn",
      key: "sn",
      render: (sn: number | null) => sn !== null ? sn : "-",
      sorter: (a: any, b: any) => (a.sn || 0) - (b.sn || 0),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => total > 0 ? total : "-",
      sorter: (a: any, b: any) => (a.total || 0) - (b.total || 0),
    },
    {
      title: "Crédit",
      dataIndex: "creditsEarned",
      key: "creditsEarned",
      render: (credits: number) => credits || "-",
      sorter: (a: any, b: any) => (a.creditsEarned || 0) - (b.creditsEarned || 0),
    },
    {
      title: "Décision",
      dataIndex: "passed",
      key: "passed",
      render: (passed: boolean) => (
        <span style={{ color: passed ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
          {passed ? "VALIDÉ" : "ÉCHEC"}
        </span>
      ),
      sorter: (a: any, b: any) => (a.passed === b.passed) ? 0 : a.passed ? 1 : -1,
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right' as const,
      width: 120,
      render: (_: unknown, record: any) => {
        const subjectCode = record.subjectCode || '';
        const hasClaimed = claimedTopics.has(subjectCode);
        
        const topicData = {
          code: subjectCode,
          title: record.subjectName || 'Sans nom',
          cc: record.cc,
          sn: record.sn,
          semester: record.semesterName?.toLowerCase().includes('1') ? 'S1' : 'S2' as 'S1' | 'S2',
          credit: record.creditsEarned || 0
        };

        return (
          <Tag
            onClick={() => showModal(topicData)}
            color={hasClaimed ? "purple" : "green"}
            className="cursor-pointer"
          >
            {hasClaimed ? "Voir" : "Réclamer"}
          </Tag>
        );
      },
    },
  ];

  
  return (
    <div className="mt-7">
      <Table
        columns={columns}
        dataSource={groupedGrades}
        rowKey={(record) => record.subjectCode}
        pagination={{ pageSize: 7 }}
        scroll={{ x: true }}
        locale={{ emptyText: groupedGrades.length === 0 ? 'Aucune note disponible' : 'Aucune donnée' }}
      />
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {currentTopic && !claimedTopics.has(currentTopic.code) ? (
            <Reclamations
                currentTopic={currentTopic}
                handleCancel={handleCancel}
                handleOk={handleClaimSuccess}
                student={student}
                formValues={formValues}
                setFormValues={handleFormSubmit}
                hasClaimed={(code: string) => claimedTopics.has(code)}
            />
        ) : currentTopic && (
            <ReclamationsDetails
                student={student}
                currentTopic={currentTopic}
                formValues={formValues}
                handleOk={handleOk}
                hasClaimed={(code: string) => claimedTopics.has(code)}
                handleCancel={handleCancel}
            />
        )}

      </Modal>
      <div className="flex justify-between mt-4 w-full">
        <Button
          icon={<PrinterIcon width={24} />}   
          className=" !text-black !py-5 mt-2 !bg-white hover:!bg-gray-50"
          onClick={handlePrintTranscript}
          disabled={!student?.grades?.length}
          size="large"
        >
          {groupedGrades.length > 0 ? 'Imprimer le relevé de notes' : 'Aucune note à imprimer'}
        </Button>
      </div>
    </div>
  );
}
