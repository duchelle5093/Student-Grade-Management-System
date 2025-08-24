import { Table, Button, Modal,Tag } from "antd";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Reclamations from "../../reclamations/Reclamations.tsx";
import { useNotification } from "../../../contexts";
import {ReclamationsDetails} from "../../reclamations";
import {StudentDataResDto, StudentGradeResDto, StudentTopicResDto} from "../../../api/reponse-dto/student.res.dto.ts";

interface GradesTableProps {
  student: StudentDataResDto;
}

export interface ReclamationValuesProps {
    reclamationType: string,
    expectedGrade: number,
    reclamationReason: string,
    description: string,
}

export default function GradesTable({ student }: GradesTableProps) {
  const initialReclamationsValues:ReclamationValuesProps = {
    reclamationType: '',
    expectedGrade: 0,
    reclamationReason: '',
    description: '',
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<StudentTopicResDto | null>(null);
  const [formValues, setFormValues] = useState(initialReclamationsValues);
  const [claimedTopics, setClaimedTopics] = useState<Set<string>>(new Set());
  const {notify} = useNotification()

  const showModal = (topic: StudentTopicResDto) => {
    setCurrentTopic(topic);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (currentTopic) {
      setClaimedTopics(prev => new Set([...prev, currentTopic.code]));
      notify({
        type:'success',
        message:"success",
        description: `Revendication envoyée pour la matière ${currentTopic.title}`
      });
      setFormValues(initialReclamationsValues);
      setIsModalVisible(false);
      setCurrentTopic(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTopic(null);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "subjectCode",
      render: (text: string) => text,
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => 
        (a.subjectCode || '').localeCompare(b.subjectCode || ''),
    },
    {
      title: "Intitulé de la matière",
      dataIndex: "subjectName",
      render: (text: string) => text,
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => 
        (a.subjectName || '').localeCompare(b.subjectName || ''),
    },
    {
      title: "Semestre",
      dataIndex: "semesterName",
      render: (text: string) => text,
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => 
        (a.semesterName || '').localeCompare(b.semesterName || ''),
    },
    {
      title: "CC/30",
      dataIndex: "value",
      render: (value: number, record: StudentGradeResDto) => 
        record.periodLabel === "CC" && value !== null && value !== undefined ? value : "",
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => {
        const aValue = a.periodLabel === "CC" ? a.value : 0;
        const bValue = b.periodLabel === "CC" ? b.value : 0;
        return (aValue || 0) - (bValue || 0);
      },
    },
    {
      title: "SN/70",
      dataIndex: "value",
      render: (value: number, record: StudentGradeResDto) => 
        record.periodLabel === "SN" && value !== null && value !== undefined ? value : "",
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => {
        const aValue = a.periodLabel === "SN" ? a.value : 0;
        const bValue = b.periodLabel === "SN" ? b.value : 0;
        return (aValue || 0) - (bValue || 0);
      },
    },
    {
      title: "Total",
      dataIndex: "value",
      render: (value: number) => (value !== null && value !== undefined ? value : ""),
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => (a.value || 0) - (b.value || 0),
    },
    {
      title: "Crédit",
      dataIndex: "creditsEarned",
      render: (credits: number | null) => (credits !== null && credits !== undefined ? credits : ""),
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => 
        (a.creditsEarned || 0) - (b.creditsEarned || 0),
    },
    {
      title: "Décision",
      dataIndex: "passed",
      render: (passed: boolean) => passed ? "valide" : "echec",
      sorter: (a: StudentGradeResDto, b: StudentGradeResDto) => 
        (a.passed === b.passed) ? 0 : a.passed ? 1 : -1,
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right',
      width: 'auto',
      render: (_: unknown, record: StudentGradeResDto) => {
        const subjectCode = record.subjectCode || '';
        const hasClaimed = claimedTopics.has(subjectCode);
        
        const topicData = {
          code: subjectCode,
          title: record.subjectName || 'Sans nom',
          cc: record.periodLabel === 'CC' ? record.value : null,
          sn: record.periodLabel === 'SN' ? record.value : null,
          semester: record.semesterName?.toLowerCase() as 'S1' | 'S2' ,
          credit: record.creditsEarned || 0
        };

        return (
          <Tag
            onClick={() => showModal(topicData)}
            color={hasClaimed ? "purple" : "green"}
            className="cursor-pointer"
          >
            {hasClaimed ? "Voir la revendication" : "Revendiquer"}
          </Tag>
        );
      },
    },
  ];

  
  return (
    <div className="mt-7">
      <Table
        columns={columns}
        dataSource={student?.grades}
        rowKey={(record) => record.subjectCode}
        pagination={{ pageSize: 7 }}
        scroll={{ x: true }}
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
                handleOk={handleOk}
                student={student}
                formValues={formValues}
                setFormValues={setFormValues}
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
          className=" !text-black !py-5 mt-2 !bg-white"
        >
          Imprimer les PV
        </Button>
      </div>
    </div>
  );
}
