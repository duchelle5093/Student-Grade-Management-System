import { GradesHeader } from "../../../components/LicenceHeader";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { EditableGradesTable } from "../../../components/EditableGradesTable";
import { useState, useMemo } from "react";
// import { fetchStudents } from "../../user/actions";
// import { useAppDispatch, useAppSelector } from "../../../store";
import { studentResDto } from "../../../api/reponse-dto/user.res.dto";
import { FakeStudents } from "../../user/data";

export const Licence1 = () => {
  //const students = useAppSelector(state => state.user.students);

  const [isTableEditable, setIsTableEditable] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [editedData, setEditedData] = useState<studentResDto[]>(FakeStudents);

  usePageTitle(
    isTableEditable ? "Edition des notes de Licence 1" : "Notes Licence 1"
  );

  //const dispatch = useAppDispatch();

  // Colonnes dynamiques selon la période (exemple)
  const period = "2023-2024";
  let extraColumns: { title: string; dataIndex: string }[] = [];
  if (period === "2023-2024") {
    extraColumns = [];
  }

  const [tableData, setTableData] = useState<studentResDto[]>(FakeStudents);


  const handleEdit = () => {
    setEditedData(tableData);
    setIsTableEditable(true);
  };

  // useEffect(() => {
  //   dispatch(fetchStudents());
  // }, [dispatch]);

  // Fonction pour GradesHeader (sans argument)
  const handleConfirm = () => {
    setTableData(editedData);
    setIsTableEditable(false);
  };

  const filteredTableData = useMemo(() => {
    const base = isTableEditable ? editedData : tableData;
    if (!searchValue) return base;
    return base.filter((student) =>
      (student.firstName || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [searchValue, tableData, editedData, isTableEditable]);

  return (
    <div>
      <GradesHeader
        title="L1"
        period={"Controle continu #1"}
        topic="Mathematiques appliquees"
        code="MATH101"
        level="Licence 1"
        NC="10"
        CANT="20"
      />
      <div className="mt-8">
        <EditableGradesTable
          extraColumns={extraColumns}
          isEditable={isTableEditable}
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
