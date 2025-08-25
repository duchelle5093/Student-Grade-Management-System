import React from 'react';
import { PDFPreview } from './PDFPreview';

const sampleStudent = {
  firstName: 'Jonathan',
  lastName: 'Christian ANYA',
  username: '17T2076',
  email: 'jonathan.anya@igniteacademy.com',
  level: 'LICENCE 2'
};

const sampleGrades = [
  { subjectCode: 'ICT201', subjectName: 'INTRODUCTION TO SOFTWARE ENGINEERING', creditsEarned: 5, value: 61.00, semesterName: 'Semestre 1', periodLabel: 'CC_1', passed: true },
  { subjectCode: 'ICT202', subjectName: 'SOFTWARE DEVELOPMENT FOR MOBILE DEVICES', creditsEarned: 5, value: 56.00, semesterName: 'Semestre 1', periodLabel: 'CC_1', passed: true },
  { subjectCode: 'ICT203', subjectName: 'DATABASE SYSTEMS', creditsEarned: 6, value: 48.00, semesterName: 'Semestre 2', periodLabel: 'CC_2', passed: false },
  { subjectCode: 'ICT204', subjectName: 'INTRODUCTION TO OPERATING SYSTEM', creditsEarned: 6, value: 52.00, semesterName: 'Semestre 1', periodLabel: 'SN_1', passed: true },
  { subjectCode: 'ICT205', subjectName: 'INTRODUCTION TO PROGRAMMING IN .NET', creditsEarned: 5, value: 66.50, semesterName: 'Semestre 2', periodLabel: 'CC_2', passed: true },
  { subjectCode: 'ICT206', subjectName: 'INTRODUCTION TO COMPUTER NETWORKS', creditsEarned: 5, value: 71.50, semesterName: 'Semestre 1', periodLabel: 'CC_1', passed: true },
  { subjectCode: 'ICT207', subjectName: 'SOFTWARE DEVELOPMENT IN JAVA', creditsEarned: 5, value: 62.00, semesterName: 'Semestre 1', periodLabel: 'SN_1', passed: true },
  { subjectCode: 'ICT208', subjectName: 'COMPUTER ARCHITECTURES', creditsEarned: 5, value: 46.00, semesterName: 'Semestre 1', periodLabel: 'CC_1', passed: false },
  { subjectCode: 'ICT209', subjectName: 'DATABASE PROGRAMMING', creditsEarned: 5, value: 63.00, semesterName: 'Semestre 2', periodLabel: 'SN_2', passed: true },
  { subjectCode: 'ICT210', subjectName: 'INTRODUCTION TO COMPUTER SECURITY', creditsEarned: 5, value: 53.00, semesterName: 'Semestre 2', periodLabel: 'CC_2', passed: true }
];

export const PDFPreviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Aperçu du Relevé de Notes - IGNITE ACADEMY</h1>
        
        <PDFPreview 
          studentData={sampleStudent} 
          grades={sampleGrades} 
        />
      </div>
    </div>
  );
};