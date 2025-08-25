import React from 'react';

interface PDFPreviewProps {
  studentData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    level: string;
  };
  grades: Array<{
    subjectCode: string;
    subjectName: string;
    creditsEarned: number;
    value: number;
    semesterName: string;
    periodLabel: string;
    passed: boolean;
  }>;
}

const calculateMention = (grade: number): string => {
  if (grade >= 80) return 'A';
  if (grade >= 70) return 'B+';
  if (grade >= 60) return 'B';
  if (grade >= 50) return 'C+';
  if (grade >= 40) return 'C';
  return 'C-';
};

export const PDFPreview: React.FC<PDFPreviewProps> = ({ studentData, grades }) => {
  const calculateStats = () => {
    const totalCredits = grades.reduce((sum, grade) => sum + grade.creditsEarned, 0);
    const weightedSum = grades.reduce((sum, grade) => sum + (grade.value * grade.creditsEarned), 0);
    const mgp = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00';
    return { totalCredits, mgp };
  };

  const { totalCredits, mgp } = calculateStats();
  const docNumber = `N°${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`;

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête officiel */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
        <div className="w-2/5">
          <div className="font-bold text-sm mb-1">IGNITE ACADEMY</div>
          <div className="text-xs text-gray-600 italic mb-2">Excellence - Innovation - Leadership</div>
        </div>
        <div className="w-1/5 flex justify-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">LOGO</span>
          </div>
        </div>
        <div className="w-2/5 text-right">
          <div className="font-bold text-sm mb-1">IGNITE ACADEMY</div>
          <div className="text-xs text-gray-600 italic mb-2">Excellence - Innovation - Leadership</div>
        </div>
      </div>



      {/* Titre du document */}
      <div className="text-center font-bold text-xl mb-2">RELEVÉ DE NOTES/TRANSCRIPT</div>
      <div className="text-right text-xs text-gray-600 mb-4">{docNumber}</div>

      {/* Informations étudiant */}
      <div className="mb-6">
        <div className="flex mb-1">
          <span className="w-1/4 font-bold text-sm">Noms et Prénoms :</span>
          <span className="w-1/3 text-sm">{studentData.firstName} {studentData.lastName}</span>
          <span className="w-1/5 font-bold text-sm text-right">Matricule :</span>
          <span className="w-1/5 text-sm text-right">{studentData.username}</span>
        </div>
        <div className="flex mb-1">
          <span className="w-1/4 font-bold text-sm">Email :</span>
          <span className="w-3/4 text-sm">{studentData.email}</span>
        </div>
        <div className="flex mb-1">
          <span className="w-1/4 font-bold text-sm">Niveau :</span>
          <span className="w-3/4 text-sm">{studentData.level}</span>
        </div>
      </div>

      {/* Tableau des notes */}
      <div className="border border-black mb-6">
        <div className="flex bg-gray-100 border-b border-black text-xs">
          <div className="w-[12%] p-1 border-r border-black font-bold text-center">Code UE</div>
          <div className="w-[38%] p-1 border-r border-black font-bold text-center">Intitulé de l'UE</div>
          <div className="w-[8%] p-1 border-r border-black font-bold text-center">Crédit</div>
          <div className="w-[8%] p-1 border-r border-black font-bold text-center">Note /100</div>
          <div className="w-[8%] p-1 border-r border-black font-bold text-center">Mention</div>
          <div className="w-[8%] p-1 border-r border-black font-bold text-center">Semestre</div>
          <div className="w-[8%] p-1 border-r border-black font-bold text-center">Période</div>
          <div className="w-[10%] p-1 font-bold text-center">Statut</div>
        </div>
        {grades.map((grade, index) => (
          <div key={index} className="flex border-b border-gray-300 text-xs">
            <div className="w-[12%] p-1 border-r border-gray-300 text-center">{grade.subjectCode}</div>
            <div className="w-[38%] p-1 border-r border-gray-300 text-left">{grade.subjectName}</div>
            <div className="w-[8%] p-1 border-r border-gray-300 text-center">{grade.creditsEarned}</div>
            <div className="w-[8%] p-1 border-r border-gray-300 text-center">{grade.value.toFixed(2)}</div>
            <div className="w-[8%] p-1 border-r border-gray-300 text-center">{calculateMention(grade.value)}</div>
            <div className="w-[8%] p-1 border-r border-gray-300 text-center">{grade.semesterName}</div>
            <div className="w-[8%] p-1 border-r border-gray-300 text-center">{grade.periodLabel}</div>
            <div className="w-[10%] p-1 text-center">{grade.passed ? 'VALIDÉ' : 'NON VALIDÉ'}</div>
          </div>
        ))}
      </div>

      {/* Section résumé */}
      <div className="flex justify-between mb-6">
        <div className="w-2/5">
          <div className="text-sm mb-1">Total Crédits : {totalCredits}</div>
          <div className="text-sm mb-1">Moyenne Générale : {mgp}/100</div>
          <div className="text-sm">Statut : {grades.every(g => g.passed) ? 'VALIDÉ' : 'EN COURS'}</div>
        </div>
        <div className="w-1/2">
          <div className="border border-black text-xs">
            <div className="flex bg-gray-100 border-b border-black">
              <div className="w-1/2 p-1 border-r border-black font-bold text-center">Mention</div>
              <div className="w-1/2 p-1 font-bold text-center">Note</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-1 border-r border-gray-300 text-center">A</div>
              <div className="w-1/2 p-1 text-center">80-100</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-1 border-r border-gray-300 text-center">B+</div>
              <div className="w-1/2 p-1 text-center">70-79</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-1 border-r border-gray-300 text-center">B</div>
              <div className="w-1/2 p-1 text-center">60-69</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-1 border-r border-gray-300 text-center">C</div>
              <div className="w-1/2 p-1 text-center">40-59</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="text-center text-xs text-gray-600 border-t border-gray-400 pt-3">
        Document officiel généré par IGNITE ACADEMY
      </div>
    </div>
  );
};