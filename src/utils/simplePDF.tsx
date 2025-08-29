// Version simplifiée pour tester le PDF
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import React from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

const SimplePDF = ({ users }: { users: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Liste des Utilisateurs</Text>
      {users.slice(0, 10).map((user, index) => (
        <Text key={index} style={styles.text}>
          {user.username} - {user.email} - {user.role}
        </Text>
      ))}
    </Page>
  </Document>
);

export const exportSimplePDF = async (users: any[]) => {
  try {
    console.log('Creating simple PDF with', users.length, 'users');
    
    const doc = <SimplePDF users={users} />;
    const blob = await pdf(doc).toBlob();
    
    console.log('PDF blob size:', blob.size);
    saveAs(blob, `test-users-${Date.now()}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Simple PDF error:', error);
    throw error;
  }
};