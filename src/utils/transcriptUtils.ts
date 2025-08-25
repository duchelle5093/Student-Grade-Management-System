import { PDFDocument } from '../components/PDFDocument';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import React from 'react';

export interface StudentTranscriptData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    level: string;
}

export interface GradeData {
    subjectCode: string;
    subjectName: string;
    creditsEarned: number;
    value: number;
    semesterName: string;
    periodLabel: string;
    passed: boolean;
}

export const generateStudentTranscript = async (
    studentData: StudentTranscriptData,
    grades: GradeData[]
) => {
    const doc = React.createElement(PDFDocument, {
        studentData,
        grades
    });

    const blob = await pdf(doc).toBlob();
    const filename = `releve_${studentData.username || 'etudiant'}.pdf`;
    
    return { blob, filename };
};

export const generateMultipleTranscripts = async (
    studentsData: Array<{ student: StudentTranscriptData; grades: GradeData[] }>
) => {
    if (studentsData.length === 1) {
        // Un seul étudiant : téléchargement direct
        const { blob, filename } = await generateStudentTranscript(
            studentsData[0].student,
            studentsData[0].grades
        );
        saveAs(blob, filename);
        return;
    }

    // Plusieurs étudiants : téléchargements multiples avec délai
    for (let i = 0; i < studentsData.length; i++) {
        const { student, grades } = studentsData[i];
        const { blob, filename } = await generateStudentTranscript(student, grades);
        
        // Ajouter un délai entre les téléchargements pour éviter les conflits
        setTimeout(() => {
            saveAs(blob, filename);
        }, i * 500); // 500ms de délai entre chaque téléchargement
    }
};

// Fonction pour générer des données de notes mockées (à remplacer par de vraies données API)
export const generateMockGrades = (): GradeData[] => {
    const subjects = [
        { code: 'ICT201', name: 'INTRODUCTION TO SOFTWARE ENGINEERING', credits: 5 },
        { code: 'ICT202', name: 'DATABASE SYSTEMS', credits: 6 },
        { code: 'ICT203', name: 'COMPUTER NETWORKS', credits: 5 },
        { code: 'ICT204', name: 'OPERATING SYSTEMS', credits: 6 },
        { code: 'ICT205', name: 'WEB DEVELOPMENT', credits: 5 }
    ];

    return subjects.map(subject => ({
        subjectCode: subject.code,
        subjectName: subject.name,
        creditsEarned: subject.credits,
        value: Math.floor(Math.random() * 40) + 50, // Note entre 50 et 90
        semesterName: Math.random() > 0.5 ? 'Semestre 1' : 'Semestre 2',
        periodLabel: Math.random() > 0.5 ? 'CC_1' : 'SN_1',
        passed: Math.random() > 0.2 // 80% de chance de réussir
    }));
};