
import { GradesHeader } from "../../../components/LicenceHeader";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { EditableGradesTable, Student } from "../../../components/EditableGradesTable";
  import { useState, useMemo, useEffect } from "react";

export const Master1 = () => {
  usePageTitle("PV Master 1");

  // Colonnes dynamiques selon la période (exemple)
  const period = "2023-2024";
  let extraColumns: { title: string; dataIndex: string }[] = [];
  if (period === "2023-2024") {
    extraColumns = [];
  }

  const [isTableEditable, setIsTableEditable] = useState(false);
  const [tableData, setTableData] = useState<Student[]>(() => {
    const saved = localStorage.getItem('master1_tableData');
    if (saved) return JSON.parse(saved);
    // ...génération par défaut...
});
  const [searchValue, setSearchValue] = useState("");
  const [editedData, setEditedData] = useState<Student[]>(tableData);

  // Synchronise editedData avec tableData à chaque changement de tableData ou d'entrée en mode édition
  useEffect(() => {
    if (isTableEditable) {
      setEditedData(tableData);
    }
  }, [isTableEditable, tableData]);

  const handleEdit = () => {
    setEditedData(tableData);
    setIsTableEditable(true);
  };
  // Fonction pour GradesHeader (sans argument)
 const handleConfirm = () => {
  setTableData(editedData);
  setIsTableEditable(false);
  localStorage.setItem('master1_tableData', JSON.stringify(editedData));
};

  const filteredTableData = useMemo(() => {
    const base = isTableEditable ? editedData : tableData;
    if (!searchValue) return base;
    return base.filter(student =>
      (student.firstName || "").toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, tableData, editedData, isTableEditable]);

  return (
    <div>
      <GradesHeader
        title="M1"
        period={'Controle continu #1'}
        topic="Mathematiques appliquees"
        code="MATH401"
        level="Licence 1"
        NC="10"
        CANT="20"
        totalStudents={30}
       
      />
      <div className="mt-8">
        <EditableGradesTable
          extraColumns={extraColumns}
          isEditable={isTableEditable}
          // onEdit={handleEdit}
          // onConfirm={handleConfirm}
          totalStudents={30}
          data={filteredTableData}
          onGradesChange={setEditedData}
           onEdit={handleEdit}
        onConfirm={handleConfirm}
        isDataEditable={isTableEditable}
        setIsDataEditable={setIsTableEditable}
        onSearch={setSearchValue}
        />
      </div>
    </div>
  );
};


// // ...existing code...

// const handleConfirm = async (data: Student[]) => {
//   setTableData(data);
//   setIsTableEditable(false);
//   // Exemple d'envoi à l'API
//   await fetch('/api/endpoint', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
// };

// // ...existing code...

// return (
//   <div>
//     <GradesHeader
//       title="L1"
//       period={period}
//       topic="Mathematics"
//       code="MATH101"
//       level="Licence 1"
//       totalStudents={30}
//     />
//     <div className="mt-8">
//       <EditableGradesTable
//         extraColumns={extraColumns}
//         isEditable={isTableEditable}
//         onEdit={handleEdit}
//         onConfirm={handleConfirm}
//       />
//     </div>
//     {/* Exemple d'affichage d'un résumé après validation */}
//     {tableData && (
//       <div className="mt-8">
//         <h3>Données validées :</h3>
//         <pre>{JSON.stringify(tableData, null, 2)}</pre>
//       </div>
//     )}
//   </div>
// );