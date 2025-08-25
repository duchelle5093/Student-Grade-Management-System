import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { PDFDocument } from '../components/PDFDocument';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
    if (data.length === 0) return;
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}.xlsx`);
};

export const exportUsersToExcel = (users: any[]) => {
    const exportData = users.map(user => ({
        'Nom d\'utilisateur': user.username,
        'Prénom': user.firstName || '',
        'Nom': user.lastName || '',
        'Email': user.email,
        'Rôle': user.role,
        'Niveau': user.level || 'Non défini',
        'Date de création': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    }));
    
    exportToExcel(exportData, `utilisateurs-${Date.now()}`, 'Utilisateurs');
};

export const exportSubjectsToExcel = (subjects: any[], teachers: any[] = []) => {
    const exportData = subjects.map(subject => {
        const teacher = teachers.find(t => t.id === subject.teacherId);
        return {
            'Code': subject.code || '',
            'Nom de la matière': subject.name,
            'Crédits': subject.credits || '',
            'Enseignant': teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné',
            'Département': subject.departmentId || '',
            'Description': subject.description || ''
        };
    });
    
    exportToExcel(exportData, `matieres-${Date.now()}`, 'Matières');
};

export const exportStatsToExcel = (stats: any) => {
    const exportData = [
        { 'Statistique': 'Total Étudiants', 'Valeur': stats.totalStudents },
        { 'Statistique': 'Total Enseignants', 'Valeur': stats.totalTeachers },
        { 'Statistique': 'Total Matières', 'Valeur': stats.totalSubjects },
        { 'Statistique': 'Total Départements', 'Valeur': stats.totalDepartments },
        { 'Statistique': 'Matières sans enseignant', 'Valeur': stats.subjectsWithoutTeacher },
        { 'Statistique': 'Taux d\'assignation (%)', 'Valeur': Math.round(stats.assignmentRate) }
    ];
    
    exportToExcel(exportData, `statistiques-${Date.now()}`, 'Statistiques');
};

// Fonctions d'export PDF
export const exportUsersToPDF = async (users: any[]) => {
    try {
        console.log('Exporting users to PDF:', users.length, 'users');
        
        const doc = React.createElement(PDFDocument, {
            title: 'Liste des Utilisateurs',
            data: users,
            type: 'users'
        });
        
        const blob = await pdf(doc).toBlob();
        console.log('PDF blob created:', blob.size, 'bytes');
        
        saveAs(blob, `utilisateurs-${Date.now()}.pdf`);
        console.log('PDF download initiated');
    } catch (error) {
        console.error('Error in exportUsersToPDF:', error);
        throw error;
    }
};

export const exportSubjectsToPDF = async (subjects: any[], teachers: any[] = []) => {
    const subjectsWithTeachers = subjects.map(subject => {
        const teacher = teachers.find(t => t.id === subject.teacherId);
        return {
            ...subject,
            teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné'
        };
    });
    
    const doc = React.createElement(PDFDocument, {
        title: 'Liste des Matières',
        data: subjectsWithTeachers,
        type: 'subjects'
    });
    
    const blob = await pdf(doc).toBlob();
    saveAs(blob, `matieres-${Date.now()}.pdf`);
};