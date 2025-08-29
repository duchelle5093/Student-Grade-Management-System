import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, DatePicker, Switch, Space, Modal, Tag } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchSemesters, updateSemester } from '../../semesters/actions';
import { SemesterResDto } from '../../../api/reponse-dto/semester.res.dto';
import { useNotification } from '../../../contexts';
import dayjs from 'dayjs';

export const SemesterManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const { semesters, loading } = useAppSelector(state => state.semesters);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSemester, setEditingSemester] = useState<SemesterResDto | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchSemesters());
    }, [dispatch]);

    // const handleCreate = () => {
    //     setEditingSemester(null);
    //     form.resetFields();
    //     setIsModalVisible(true);
    // };

    const handleEdit = (semester: SemesterResDto) => {
        setEditingSemester(semester);
        form.setFieldsValue({
            name: semester.name,
            startDate: dayjs(semester.startDate),
            endDate: dayjs(semester.endDate),
            active: semester.active
        });
        setIsModalVisible(true);
    };

    const handleToggleActive = async (semester: SemesterResDto) => {
        try {
            const payload = {
                ...semester,
                active: !semester.active
            };
            await dispatch(updateSemester(payload)).unwrap();
            notify({ 
                type: 'success', 
                message: 'Succès', 
                description: `Semestre ${payload.active ? 'activé' : 'désactivé'} avec succès` 
            });
            dispatch(fetchSemesters());
        } catch (error) {
            notify({ type: 'error', message: 'Erreur', description: 'Erreur lors de la modification' });
        }
    };

    // const handleDelete = (semester: SemesterResDto) => {
    //     const hasDependencies = semester.active; // Simplification - en réalité vérifier périodes/notes
    //     
    //     Modal.confirm({
    //         title: 'Confirmer la suppression',
    //         content: hasDependencies 
    //             ? `Attention: Le semestre "${semester.name}" est actif et peut contenir des données. Êtes-vous sûr de vouloir le supprimer ?`
    //             : `Êtes-vous sûr de vouloir supprimer le semestre "${semester.name}" ?`,
    //         okType: hasDependencies ? 'danger' : 'primary',
    //         onOk: async () => {
    //             try {
    //                 await dispatch(deleteSemester(semester.id)).unwrap();
    //                 notify({ type: 'success', message: 'Succès', description: 'Semestre supprimé avec succès' });
    //             } catch (error) {
    //                 notify({ type: 'error', message: 'Erreur', description: 'Erreur lors de la suppression' });
    //             }
    //         }
    //     });
    // };

    const validateDates = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
        if (startDate.isAfter(endDate)) {
            throw new Error('La date de début doit être antérieure à la date de fin');
        }
        
        const existingSemesters = semesters.filter(s => editingSemester ? s.id !== editingSemester.id : true);
        const hasOverlap = existingSemesters.some(semester => {
            const semStart = dayjs(semester.startDate);
            const semEnd = dayjs(semester.endDate);
            return (startDate.isBefore(semEnd) && endDate.isAfter(semStart));
        });
        
        if (hasOverlap) {
            throw new Error('Les dates se chevauchent avec un autre semestre');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            validateDates(values.startDate, values.endDate);
            
            if (editingSemester) {
                const payload = {
                    id: editingSemester.id,
                    name: values.name,
                    startDate: values.startDate.format('YYYY-MM-DD'),
                    endDate: values.endDate.format('YYYY-MM-DD'),
                    active: values.active || false,
                    orderIndex: editingSemester.orderIndex
                };
                await dispatch(updateSemester(payload)).unwrap();
                notify({ type: 'success', message: 'Succès', description: 'Semestre modifié avec succès' });
            // } else {
            //     const nextOrder = Math.max(...semesters.map(s => s.orderIndex), 0) + 1;
            //     const payload = {
            //         name: values.name,
            //         startDate: values.startDate.format('YYYY-MM-DD'),
            //         endDate: values.endDate.format('YYYY-MM-DD'),
            //         active: values.active || false,
            //         orderIndex: nextOrder
            //     };
            //     await dispatch(createSemester(payload)).unwrap();
            //     notify({ type: 'success', message: 'Succès', description: 'Semestre créé avec succès' });
            }

            setIsModalVisible(false);
            dispatch(fetchSemesters());
        } catch (error: any) {
            notify({ type: 'error', message: 'Erreur', description: error.message || 'Erreur lors de l\'opération' });
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
            title: 'Statut',
            dataIndex: 'active',
            key: 'active',
            render: (active: boolean, record: SemesterResDto) => (
                <Space>
                    {active ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>Actif</Tag>
                    ) : (
                        <Tag color="default">Inactif</Tag>
                    )}
                    <Switch 
                        checked={active} 
                        size="small"
                        onChange={() => handleToggleActive(record)}
                    />
                </Space>
            )
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
                    {/* <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(record)}
                    /> */}
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h3>Gestion des semestres</h3>
                {/* <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleCreate}
                    style={{ backgroundColor: '#6EADFF', borderColor: '#6EADFF' }}
                >
                    Nouveau semestre
                </Button> */}
            </div>

            <Table
                columns={columns}
                dataSource={semesters}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                defaultSortOrder="ascend"
                rowClassName={(record) => record.active ? 'active-semester-row' : ''}
            />

            <Modal
                title={editingSemester ? 'Modifier le semestre' : 'Créer un semestre'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <div key="footer" style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <Button 
                            key="cancel" 
                            onClick={() => setIsModalVisible(false)}
                            style={{ 
                                flex: 1, 
                                borderColor: '#ff4d4f', 
                                color: '#ff4d4f',
                                backgroundColor: '#fff'
                            }}
                        >
                            Annuler
                        </Button>
                        <Button 
                            key="confirm" 
                            type="primary" 
                            onClick={() => form.submit()}
                            loading={loading}
                            style={{ 
                                flex: 1, 
                                backgroundColor: '#6EADFF', 
                                borderColor: '#6EADFF' 
                            }}
                        >
                            Confirmer
                        </Button>
                    </div>
                ]}
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

                    {!editingSemester && (
                        <Form.Item
                            name="active"
                            label="Activer ce semestre"
                            valuePropName="checked"
                            extra="Attention: Activer ce semestre désactivera automatiquement les autres"
                        >
                            <Switch />
                        </Form.Item>
                    )}
                    
                    {editingSemester && (
                        <Form.Item
                            name="active"
                            label="Semestre actif"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};