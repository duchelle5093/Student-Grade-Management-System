import { Table, Button, Modal,Tag } from "antd";
import { PrinterIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { studentResDto, Topic } from "../../../api/reponse-dto/user.res.dto";
import Reclamations from "./Reclamations";
import { useNotification } from "../../../contexts";

interface GradesTableProps {
  student: studentResDto;
}

export interface ReclamationValuesProps {
   reclamationType: string,
    expectedGrade: number,
    reclamationReason: string,
    description: string,
}

export default function GradesTable({ student }: GradesTableProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  const {notify} = useNotification()



  const initialReclamationsValues:ReclamationValuesProps = {
     reclamationType: '',
    expectedGrade: 0,
    reclamationReason: '',
    description: '',
  }

   const [formValues, setFormValues] = useState(initialReclamationsValues);


  const showModal = (topic: Topic) => {
    setCurrentTopic(topic);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    notify({
      type:'success',
      message:"success",
      description: `Réclamation envoyée pour la matière   ${currentTopic?.title}`
    })
    setFormValues(initialReclamationsValues)
    setIsModalVisible(false);
    setCurrentTopic(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentTopic(null);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      render: (text: string) => text,
      sorter: (a: Topic, b: Topic) => a.code.localeCompare(b.code),
    },
    {
      title: "Intitule de la matiere",
      dataIndex: "title",
      render: (text: string) => text,
      sorter: (a: Topic, b: Topic) => a.title.localeCompare(b.title),
    },
    {
      title: "Semestre",
      dataIndex: "semester",
      render: (text: string) => text,
      sorter: (a: Topic, b: Topic) => a.semester.localeCompare(b.semester),
    },
    {
      title: "CC/30",
      dataIndex: "cc",
      render: (cc: number | null) =>
        cc !== null && cc !== undefined ? cc : "",
      sorter: (a: Topic, b: Topic) => (a.cc || 0) - (b.cc || 0),
    },
    {
      title: "SN/70",
      dataIndex: "sn",
      render: (sn: number | null) =>
        sn !== null && sn !== undefined ? sn : "",
      sorter: (a: Topic, b: Topic) => (a.sn || 0) - (b.sn || 0),
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (_: unknown, record: Topic) => {
        const cc = record.cc || 0;
        const sn = record.sn || 0;
        return cc + sn;
      },
      sorter: (a: Topic, b: Topic) =>
        (a.cc || 0) + (a.sn || 0) - ((b.cc || 0) + (b.sn || 0)),
    },
    {
      title: "Mention",
      dataIndex: "mention",
      render: (_: unknown, record: Topic) => {
        const cc = record.cc || 0;
        const sn = record.sn || 0;
        const total = cc + sn;
        return total >= 50 ? "valide" : "echec";
      },
      sorter: () => 0,
    },
    {
      title: "Decision",
      dataIndex: "decision",
      render: (_: unknown, record: Topic) => {
        const cc = record.cc || 0;
        const sn = record.sn || 0;
        const total = cc + sn;
        return total >= 50 ? "valide" : "echec";
      },
      sorter: () => 0,
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right',
      width: 'auto',
      render: (_: unknown, record: Topic) => {
        return (
          <Tag
            onClick={() => showModal(record)}
            color="green"
            className="cursor-pointer"
          >
            Revendication
          </Tag>
        );
      },
    },
  ];

  
  return (
    <div className="mt-7">
      <Table
        columns={columns}
        dataSource={student.topics}
        rowKey={(record) => record.code}
        pagination={{ pageSize: 7 }}
        scroll={{ x: true }}
      />
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
       <Reclamations 
        currentTopic={currentTopic}
        handleCancel={handleCancel}
        handleOk={handleOk}
        student={student}
        formValues={formValues}
        setFormValues={setFormValues}
       />
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
