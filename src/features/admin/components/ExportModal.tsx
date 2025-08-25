import React, { useState } from 'react';
import { Modal, Form, Select, Button, message, DatePicker } from 'antd';
import { FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../store';
import { exportUsersToPDF, exportSubjectsToPDF } from '../../../utils/exportUtils';

interface ExportModalProps {
    visible: boolean;
    onCancel: () => void;
}

interface ExportFormData {
    level: string;
    subjectId?: string;
    documentType: string;
    periodLabel: string;
    semesterId?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { departments = [], students = [], teachers = [] } = useAppSelector(state => state.admin || {});
    const { allSubjects: subjects = [] } = useAppSelector(state => state.subjects || {});

    const handleExport = async (values: ExportFormData) => {
        setLoading(true);
        try {
            if (values.documentType === 'users') {
                const allUsers = [...students, ...teachers];
                await exportUsersToPDF(allUsers);
            } else if (values.documentType === 'subjects') {
                await exportSubjectsToPDF(subjects, teachers);
            }
            
            message.success('PDF généré avec succès');
            onCancel();
        } catch (error) {
            console.error('PDF Export Error:', error);
            message.error('Erreur lors de la génération du PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilePdfOutlined style={{ color: '#6EADFF' }} />
                    Générer un relevé PDF
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleExport}
                initialValues={{
                    documentType: 'transcript',
                    periodLabel: 'Semestre 1 2024'
                }}
            >
                <Form.Item
                    name="level"
                    label="Niveau d'étude"
                    rules={[{ required: true, message: 'Sélectionnez un niveau' }]}
                >
                    <Select placeholder="Choisir un niveau">
                        <Select.Option value="LEVEL1">Licence 1</Select.Option>
                        <Select.Option value="LEVEL2">Licence 2</Select.Option>
                        <Select.Option value="LEVEL3">Licence 3</Select.Option>
                        <Select.Option value="LEVEL4">Master 1</Select.Option>
                        <Select.Option value="LEVEL5">Master 2</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="subjectId"
                    label="Matière (optionnel)"
                >
                    <Select placeholder="Toutes les matières" allowClear>
                        {subjects.map(subject => (
                            <Select.Option key={subject.id} value={subject.id}>
                                {subject.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="documentType"
                    label="Type de document"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="users">Liste des utilisateurs</Select.Option>
                        <Select.Option value="subjects">Liste des matières</Select.Option>
                        <Select.Option value="transcript">Relevé de notes</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="periodLabel"
                    label="Période"
                    rules={[{ required: true, message: 'Saisissez la période' }]}
                >
                    <Select>
                        <Select.Option value="Semestre 1 2024">Semestre 1 2024</Select.Option>
                        <Select.Option value="Semestre 2 2024">Semestre 2 2024</Select.Option>
                        <Select.Option value="Année 2024">Année 2024</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="semesterId"
                    label="ID Semestre (optionnel)"
                >
                    <Select placeholder="Sélectionner un semestre" allowClear>
                        <Select.Option value="1">Semestre 1</Select.Option>
                        <Select.Option value="2">Semestre 2</Select.Option>
                    </Select>
                </Form.Item>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={loading ? <LoadingOutlined /> : <FilePdfOutlined />}
                        style={{ backgroundColor: '#6EADFF', borderColor: '#6EADFF' }}
                    >
                        Générer PDF
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};