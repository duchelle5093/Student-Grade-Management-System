import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, DatePicker, Switch, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchSemesters, createSemester, updateSemesters, deleteSemester } from '../../semesters/actions';
import { SemesterResDto } from '../../../api/reponse-dto/semester.res.dto';
import dayjs from 'dayjs';

export const SemesterManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { semesters, loading } = useAppSelector(state => state.semesters);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSemester, setEditingSemester] = useState<SemesterResDto | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchSemesters());
    }, [dispatch]);

    const handleCreate = () => {
        setEditingSemester(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (semester: SemesterResDto) => {
        setEditingSemester(semester);
        form.setFieldsValue({
            name: semester.name,
            startDate: dayjs(semester.startDate),
            endDate: dayjs(semester.endDate),
            active: semester.active,
            orderIndex: semester.orderIndex
        });
        setIsModalVisible(true);
    };

    const handleDelete = (semester: SemesterResDto) => {
        Modal.confirm({
            title: 'Confirmer la suppression',
            content: `Êtes-vous sûr de vouloir supprimer le semestre "${semester.name}" ?`,
            onOk: async () => {
                try {
                    await dispatch(deleteSemester(semester.id)).unwrap();
                    message.success('Semestre supprimé');
                } catch (error) {
                    message.error('Erreur lors de la suppression');
                }
            }
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingSemester) {
                const payload = [{
                    id: editingSemester.id,
                    name: values.name,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    endDate: values.endDate.format('YYYY-MM-DD'),
                    active: values.active || false,
                    orderIndex: values.orderIndex || 1
                }];
                await dispatch(updateSemesters(payload)).unwrap();
                message.success('Semestre modifié');
            } else {
                const payload = {
                    name: values.name,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    endDate: values.endDate.format('YYYY-MM-DD'),
                    active: values.active || false
                };
                await dispatch(createSemester(payload)).unwrap();
                message.success('Semestre créé');
            }

            setIsModalVisible(false);
        } catch (error) {
            message.error('Erreur lors de l\'opération');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date de début',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Date de fin',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Actif',
            dataIndex: 'active',
            key: 'active',
            render: (active: boolean) => (
                <Switch checked={active} disabled />
            )
        },
        {
            title: 'Ordre',
            dataIndex: 'orderIndex',
            key: 'orderIndex',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: SemesterResDto) => (
                <Space>
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h3>Gestion des semestres</h3>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleCreate}
                    style={{ backgroundColor: '#6EADFF', borderColor: '#6EADFF' }}
                >
                    Nouveau semestre
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={semesters}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={editingSemester ? 'Modifier le semestre' : 'Créer un semestre'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Nom du semestre"
                        rules={[{ required: true, message: 'Le nom est requis' }]}
                    >
                        <Input placeholder="Ex: Semestre 1 2024-2025" />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Date de début"
                        rules={[{ required: true, message: 'La date de début est requise' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="Date de fin"
                        rules={[{ required: true, message: 'La date de fin est requise' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="orderIndex"
                        label="Ordre"
                        rules={[{ required: true, message: 'L\'ordre est requis' }]}
                    >
                        <Input type="number" placeholder="1" />
                    </Form.Item>

                    <Form.Item
                        name="active"
                        label="Semestre actif"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};