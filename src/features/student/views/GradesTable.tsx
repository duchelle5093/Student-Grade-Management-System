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

  // Regrouper les notes par matière avec colonnes séparées
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
          cc1: null as number | null,
          cc2: null as number | null,
          sn1: null as number | null,
          sn2: null as number | null,
          total: 0,
          passed: false
        };
      }
      
      // Assigner selon type
      switch (grade.type) {
        case 'CC_1':
          acc[key].cc1 = grade.value;
          break;
        case 'CC_2':
          acc[key].cc2 = grade.value;
          break;
        case 'SN_1':
          acc[key].sn1 = grade.value;
          break;
        case 'SN_2':
          acc[key].sn2 = grade.value;
          break;
      }
      
      // Utiliser la propriété passed du backend
      acc[key].passed = grade.passed;
      
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
        level: student.level || '',
        gpa: student.gpa || 0
      };

      const grades = groupedGrades.map(grade => ({
        subjectCode: grade.subjectCode,
        subjectName: grade.subjectName,
        creditsEarned: grade.creditsEarned,
        value: grade.total,
        cc1: grade.cc1,
        cc2: grade.cc2,
        sn1: grade.sn1,
        sn2: grade.sn2,
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
      title: "CC_1",
      dataIndex: "cc1",
      key: "cc1",
      render: (cc1: number | null) => cc1 !== null ? cc1.toFixed(1) : "-",
      sorter: (a: any, b: any) => (a.cc1 || 0) - (b.cc1 || 0),
    },
    {
      title: "CC_2",
      dataIndex: "cc2",
      key: "cc2",
      render: (cc2: number | null) => cc2 !== null ? cc2.toFixed(1) : "-",
      sorter: (a: any, b: any) => (a.cc2 || 0) - (b.cc2 || 0),
    },
    {
      title: "SN_1",
      dataIndex: "sn1",
      key: "sn1",
      render: (sn1: number | null) => sn1 !== null ? sn1.toFixed(1) : "-",
      sorter: (a: any, b: any) => (a.sn1 || 0) - (b.sn1 || 0),
    },
    {
      title: "SN_2",
      dataIndex: "sn2",
      key: "sn2",
      render: (sn2: number | null) => sn2 !== null ? sn2.toFixed(1) : "-",
      sorter: (a: any, b: any) => (a.sn2 || 0) - (b.sn2 || 0),
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
          cc: record.cc1, // Utiliser cc1 pour compatibilité
          sn: record.sn1, // Utiliser sn1 pour compatibilité
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
      
      {/* Ligne moyenne générale */}
      {student?.gpa && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-blue-800">
              Moyenne Générale (GPA)
            </span>
            <span className="text-xl font-bold text-blue-900">
              {student.gpa.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        centered
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
