import { useState } from "react";
import { Table, Input, Button, Tag } from "antd";
import { MagnifyingGlassCircleIcon, PrinterIcon } from "@heroicons/react/24/solid";
import { GradesEdition } from "./GradesEditionBtn";
import { EditPvButton } from "./EditPvButton";
import { studentResDto } from "../api/reponse-dto/user.res.dto";
import { FakeStudents } from "../features/user/data";

// Type pour chaque étudiant, avec index signature pour colonnes dynamiques
// export type Student = {
//   key: number;
//   studentId: string;
//   firstName: string;
//   [key: string]: string | number;
// };

// Génère n étudiants factices
// const generateStudents = (count: number): Student[] => {
//   return Array.from({ length: count }, (_, i) => ({
//     key: i,
//     studentId: `ID${i + 1}`,
//     firstName: `Nom${i + 1}`,
//     lastName: `Prenom${i + 1}`,
//   }));
// };



interface EditableGradesTableProps {
  extraColumns?: { title: string; dataIndex: string }[];
  isEditable: boolean;
  //   onEdit: () => void;
  //   onConfirm: (data: Student[]) => void;
  data: studentResDto[];
  onGradesChange?: (data: studentResDto[]) => void;
  onEdit: () => void;
  onConfirm: () => void;
  isDataEditable?: boolean;
  setIsDataEditable: (value: boolean) => void;
  onSearch?: (value: string) => void;
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
  onSearch
}: EditableGradesTableProps) => {
  //const [dataSource] = useState(generateStudents(totalStudents));
  const [editingData, setEditingData] = useState(data);
  // Si data (filtrée) est fournie, on l'utilise comme source d'affichage
  const displayData =
    data !== undefined ? data : isEditable ? editingData : [];

  // Colonnes de base
  const baseColumns = [
    {
      title: "Matricule",
      dataIndex: "id",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => String(a.id).localeCompare(String(b.id)),
    },
    {
      title: "Noms et prénoms",
      dataIndex: "firstName",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => String(a.firstName).localeCompare(String(b.firstName)),
    },
    {
      title: "CC#1",
      dataIndex: "cc1",
      render: (text: string, record: studentResDto) =>
        isEditable ? (
          <Input
            type="number"
            value={(record.cc1 as string) || ""}
            onChange={(e) => {
              const newData = editingData.map((student) =>
                student.id === record.id
                  ? { ...student, cc1: e.target.value }
                  : student
              );
              setEditingData(newData);
              onGradesChange?.(newData);
            }}
          />
        ) : (
          text
      ),
      sorter: (a: studentResDto, b: studentResDto) => Number(a.cc1 || 0) - Number(b.cc1 || 0),
    },
    {
      title: "TP",
      dataIndex: "tp",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => Number(a.tp || 0) - Number(b.tp || 0),
      // isEditable ? (
      //   <Input
      //     value={editingData[idx].tp}
      //     onChange={e => {
      //       const newData = [...editingData];
      //       newData[idx].tp = e.target.value;
      //       setEditingData(newData);
      //     }}
      //   />
      // ) : (
      //   text
      // ),
    },
    {
      title: "SN#1",
      dataIndex: "sn1",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => Number(a.sn1 || 0) - Number(b.sn1 || 0),
      // isEditable ? (
      //   <Input
      //     value={editingData[idx].sn1}
      //     onChange={e => {
      //       const newData = [...editingData];
      //       newData[idx].sn1 = e.target.value;
      //       setEditingData(newData);
      //     }}
      //   />
      // ) : (
      //   text
      // ),
    },
    {
      title: "CC#2",
      dataIndex: "cc2",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => Number(a.cc2 || 0) - Number(b.cc2 || 0),
      // isEditable ? (
      //   <Input
      //     value={editingData[idx].cc2}
      //     onChange={e => {
      //       const newData = [...editingData];
      //       newData[idx].cc2 = e.target.value;
      //       setEditingData(newData);
      //     }}
      //   />
      // ) : (
      //   text
      // ),
    },
    {
      title: "TP#2",
      dataIndex: "tp2",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => Number(a.tp2 || 0) - Number(b.tp2 || 0),
    },
    {
      title: "SN#2",
      dataIndex: "sn2",
      render: (text: string) => text,
      sorter: (a: studentResDto, b: studentResDto) => Number(a.sn2 || 0) - Number(b.sn2 || 0),
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (_: any, record: studentResDto) => {
        // Additionne les champs souhaités (ici cc1, tp, sn1)
        const cc1 = Number(record.cc1) || 0;
        const tp = Number(record.tp) || 0;
        const sn1 = Number(record.sn1) || 0;
        return cc1 + tp + sn1;
      },
      sorter: (a: studentResDto, b: studentResDto) => {
        const totalA = (Number(a.cc1) || 0) + (Number(a.tp) || 0) + (Number(a.sn1) || 0);
        const totalB = (Number(b.cc1) || 0) + (Number(b.tp) || 0) + (Number(b.sn1) || 0);
        return totalA - totalB;
      },
  },
    
  ];

  // Colonnes supplémentaires dynamiques
  const columns = [
    ...baseColumns,
    ...extraColumns.map((col) => ({
      ...col,
      render: (text: string, _record: studentResDto, idx: number) =>
        isEditable ? (
          <Input
            value={(editingData[idx][col.dataIndex] as string) || ""}
            onChange={(e) => {
              const newData = [...editingData];
              newData[idx][col.dataIndex] = e.target.value;
              setEditingData(newData);
            }}
          />
        ) : (
          text
        ),
    })),
  ];

  // Compte le nombre d'étudiants ayant au moins une note attribuée (hors nom/prénom/matricule)
  const gradeFields = ["cc1", "tp", "sn1", "cc2", "tp2", "sn2", ...extraColumns.map(col => col.dataIndex)];
  const attributedGrades = displayData.filter(student =>
    gradeFields.some(field => {
      const value = student[field];
      return value !== undefined && value !== null && value !== "";
    })
  ).length;

  const tagColor = ()=>{
    if (attributedGrades < FakeStudents.length) {
      return "orange";
    } else return "green";
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between mt-4 mb-2 w-full ">
            <div className="flex w-3/4">
                <Button
                    icon={<MagnifyingGlassCircleIcon width={24}/>} 
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
            <div>
                { 
                    isDataEditable ? (
                        <GradesEdition editGrades={onEdit} confirmGrades={onConfirm} setIsTableEditable={setIsDataEditable}/>
                    ) : (
                        <EditPvButton setIsTableEditable={setIsDataEditable} onEdit={onEdit} />
                    )
                }   
            </div>
         
        </div>
      <Table
        columns={columns}
        dataSource={displayData}
        pagination={{ pageSize: 7 }}
        scroll={{ x: true }}
      />
      <div className="flex justify-between mt-4 w-full">
        <Button
          icon={<PrinterIcon width={24} />}
          className={` !text-black !py-5 mt-2 ${
            isEditable ? "!bg-gray-200 border-black" : "!bg-white"
          }`}
          disabled={isEditable}
        >
          Imprimer les PV
        </Button>
        <div>
            <Tag 
                color={tagColor()} 
                className="!h-9 !flex !items-center !justify-center !font-bold"
            >
                {attributedGrades} notes attribuées pour {FakeStudents.length} étudiants
            </Tag>
        </div>
      </div>

    </div>
  );
};
