import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontSize: 9,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  leftHeader: {
    width: '35%',
  },
  centerHeader: {
    width: '30%',
    alignItems: 'center',
  },
  rightHeader: {
    width: '35%',
    alignItems: 'flex-end',
  },
  institutionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 1,
  },
  subText: {
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 8,
    color: '#666666',
  },
  facultySection: {
    textAlign: 'center',
    marginBottom: 10,
  },
  facultyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  facultySubtitle: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 5,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 3,
  },
  documentNumber: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'right',
    marginBottom: 10,
  },
  studentInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    width: '25%',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },
  infoValue: {
    width: '35%',
    fontSize: 9,
    color: '#000000',
  },
  infoLabelRight: {
    width: '20%',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'right',
  },
  infoValueRight: {
    width: '20%',
    fontSize: 9,
    color: '#000000',
    textAlign: 'right',
  },
  gradesTable: {
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    minHeight: 20,
  },
  codeCell: {
    width: '12%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  titleCell: {
    width: '38%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  creditCell: {
    width: '8%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  gradeCell: {
    width: '8%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  mentionCell: {
    width: '8%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  semesterCell: {
    width: '8%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  yearCell: {
    width: '8%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  decisionCell: {
    width: '10%',
    padding: 2,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 7,
    color: '#000000',
    textAlign: 'center',
  },
  cellTextLeft: {
    fontSize: 7,
    color: '#000000',
    textAlign: 'left',
  },
  headerText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  summaryLeft: {
    width: '45%',
  },
  summaryRight: {
    width: '50%',
  },
  summaryText: {
    fontSize: 9,
    color: '#000000',
    marginBottom: 2,
  },
  legendTable: {
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 10,
  },
  legendRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
  },
  legendCell: {
    width: '25%',
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  legendText: {
    fontSize: 6,
    color: '#000000',
    textAlign: 'center',
  },
});

interface PDFDocumentProps {
  studentData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    level: string;
    gpa?: number;
  };
  grades: Array<{
    subjectCode: string;
    subjectName: string;
    creditsEarned: number;
    value: number;
    cc1?: number;
    cc2?: number;
    sn1?: number;
    sn2?: number;
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

export const PDFDocument: React.FC<PDFDocumentProps> = ({ studentData, grades }) => {
  const calculateStats = () => {
    const totalCredits = grades.reduce((sum, grade) => sum + grade.creditsEarned, 0);
    const weightedSum = grades.reduce((sum, grade) => sum + (grade.value * grade.creditsEarned), 0);
    const mgp = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : '0.00';
    return { totalCredits, mgp };
  };

  const { totalCredits, mgp } = calculateStats();
  const docNumber = `N°${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête officiel */}
        <View style={styles.headerSection}>
          <View style={styles.leftHeader}>
            <Text style={styles.institutionText}>IGNITE ACADEMY</Text>
            <Text style={styles.subText}>Excellence - Innovation - Leadership</Text>
          </View>
          <View style={styles.centerHeader}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>LOGO</Text>
            </View>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.institutionText}>IGNITE ACADEMY</Text>
            <Text style={styles.subText}>Excellence - Innovation - Leadership</Text>
          </View>
        </View>



        {/* Titre du document */}
        <Text style={styles.documentTitle}>RELEVÉ DE NOTES/TRANSCRIPT</Text>
        <Text style={styles.documentNumber}>{docNumber}</Text>

        {/* Informations étudiant */}
        <View style={styles.studentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Noms et Prénoms :</Text>
            <Text style={styles.infoValue}>{studentData.firstName} {studentData.lastName}</Text>
            <Text style={styles.infoLabelRight}>Matricule :</Text>
            <Text style={styles.infoValueRight}>{studentData.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email :</Text>
            <Text style={styles.infoValue}>{studentData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Niveau :</Text>
            <Text style={styles.infoValue}>{studentData.level}</Text>
          </View>
        </View>

        {/* Tableau des notes */}
        <View style={styles.gradesTable}>
          <View style={styles.tableHeader}>
            <View style={styles.codeCell}>
              <Text style={styles.headerText}>Code</Text>
            </View>
            <View style={styles.titleCell}>
              <Text style={styles.headerText}>Intitulé de la matière</Text>
            </View>
            <View style={styles.gradeCell}>
              <Text style={styles.headerText}>CC_1</Text>
            </View>
            <View style={styles.gradeCell}>
              <Text style={styles.headerText}>CC_2</Text>
            </View>
            <View style={styles.gradeCell}>
              <Text style={styles.headerText}>SN_1</Text>
            </View>
            <View style={styles.gradeCell}>
              <Text style={styles.headerText}>SN_2</Text>
            </View>
            <View style={styles.creditCell}>
              <Text style={styles.headerText}>Crédit</Text>
            </View>
            <View style={styles.decisionCell}>
              <Text style={styles.headerText}>Décision</Text>
            </View>
          </View>
          {grades.map((grade, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.codeCell}>
                <Text style={styles.cellText}>{grade.subjectCode}</Text>
              </View>
              <View style={styles.titleCell}>
                <Text style={styles.cellTextLeft}>{grade.subjectName}</Text>
              </View>
              <View style={styles.gradeCell}>
                <Text style={styles.cellText}>{grade.cc1 || "-"}</Text>
              </View>
              <View style={styles.gradeCell}>
                <Text style={styles.cellText}>{grade.cc2 || "-"}</Text>
              </View>
              <View style={styles.gradeCell}>
                <Text style={styles.cellText}>{grade.sn1 || "-"}</Text>
              </View>
              <View style={styles.gradeCell}>
                <Text style={styles.cellText}>{grade.sn2 || "-"}</Text>
              </View>
              <View style={styles.creditCell}>
                <Text style={styles.cellText}>{grade.creditsEarned}</Text>
              </View>
              <View style={styles.decisionCell}>
                <Text style={styles.cellText}>{grade.passed ? 'VALIDÉ' : 'ÉCHEC'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section moyenne générale */}
        <View style={styles.summarySection}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryText}>Total Crédits : {totalCredits}</Text>
            <Text style={[styles.summaryText, { fontSize: 12, fontWeight: 'bold' }]}>Moyenne Générale (GPA) : {studentData.gpa ? studentData.gpa.toFixed(2) : mgp}</Text>
            <Text style={styles.summaryText}>Statut : {grades.every(g => g.passed) ? 'VALIDÉ' : 'EN COURS'}</Text>
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.legendTable}>
              <View style={styles.legendRow}>
                <View style={styles.legendCell}><Text style={styles.legendText}>Mention</Text></View>
                <View style={styles.legendCell}><Text style={styles.legendText}>Note</Text></View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendCell}><Text style={styles.legendText}>A</Text></View>
                <View style={styles.legendCell}><Text style={styles.legendText}>80-100</Text></View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendCell}><Text style={styles.legendText}>B+</Text></View>
                <View style={styles.legendCell}><Text style={styles.legendText}>70-79</Text></View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendCell}><Text style={styles.legendText}>B</Text></View>
                <View style={styles.legendCell}><Text style={styles.legendText}>60-69</Text></View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};