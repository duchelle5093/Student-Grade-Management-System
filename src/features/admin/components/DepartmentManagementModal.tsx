import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    Table, 
    Button, 
    Form, 
    Input, 
    Space, 
    Tooltip,
    Select,
    Tag,
    Typography,
    Row,
    Col
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useNotification } from '../../../contexts';
import { 
    createDepartment, 
    updateDepartment, 
    deleteDepartment,
    DepartmentData
} from '../departments-actions';
import { fetchAllDepartments } from '../actions';
import { fetchAllSubjects } from '../../subjects/actions';

const { Title, Text } = Typography;
const { Option } = Select;

interface DepartmentManagementModalProps {
    visible: boolean;
    onCancel: () => void;
}

export const DepartmentManagementModal: React.FC<DepartmentManagementModalProps> = ({
    visible,
    onCancel
}) => {
    const dispatch = useAppDispatch();
    const { departments = [], loading } = useAppSelector(state => state.admin);
    const { allSubjects: subjects = [] } = useAppSelector(state => state.subjects || {});
    const { notify } = useNotification();
    
    const [form] = Form.useForm();
    const [editingDept, setEditingDept] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        if (visible) {
            dispatch(fetchAllDepartments());
            dispatch(fetchAllSubjects());
        }
    }, [visible, dispatch]);

    const handleCreate = async (values: DepartmentData) => {
        try {
            const result = await dispatch(createDepartment(values));
            if (createDepartment.fulfilled.match(result)) {
                notify({
                    type: 'success',
                    message: 'Département créé',
                    description: 'Le département a été créé avec succès'
                });
                form.resetFields();
                setShowForm(false);
                dispatch(fetchAllDepartments());
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur de création',
                description: 'Impossible de créer le département'
            });
        }
    };

    const handleUpdate = async (values: DepartmentData) => {
        if (!editingDept) return;
        
        try {
            const result = await dispatch(updateDepartment({ 
                id: editingDept.id, 
                departmentData: values 
            }));
            if (updateDepartment.fulfilled.match(result)) {
                notify({
                    type: 'success',
                    message: 'Département modifié',
                    description: 'Les modifications ont été enregistrées'
                });
                form.resetFields();
                setShowForm(false);
                setEditingDept(null);
                dispatch(fetchAllDepartments());
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur de modification',
                description: 'Impossible de modifier le département'
            });
        }
    };

    const handleDelete = (dept: any) => {
        Modal.confirm({
            title: 'Confirmer la suppression',
            content: `Êtes-vous sûr de vouloir supprimer le département "${dept.name}" ?`,
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: async () => {
                try {
                    const result = await dispatch(deleteDepartment(dept.id));
                    if (deleteDepartment.fulfilled.match(result)) {
                        notify({
                            type: 'success',
                            message: 'Département supprimé',
                            description: `${dept.name} a été supprimé avec succès`
                        });
                        dispatch(fetchAllDepartments());
                    }
                } catch (error) {
                    notify({
                        type: 'error',
                        message: 'Erreur de suppression',
                        description: 'Impossible de supprimer le département'
                    });
                }
            }
        });
    };



    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Text strong>{name}</Text>
        },
        {
            title: 'Matières',
            key: 'subjects',
            render: (record: any) => {
                const deptSubjects = subjects.filter(s => s.departmentName === record.name);
                return <Tag color="blue">{deptSubjects.length} matières</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: any) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingDept(record);
                                form.setFieldsValue({
                                    name: record.name,
                                    subjectIds: subjects
                                        .filter(s => s.departmentName === record.name)
                                        .map(s => s.id)
                                });
                                setShowForm(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <>
            <Modal
                title="Gestion des Départements"
                open={visible}
                onCancel={onCancel}
                width={900}
                footer={null}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingDept(null);
                            form.resetFields();
                            setShowForm(true);
                        }}
                        style={{ backgroundColor: '#6EADFF', borderColor: '#6EADFF' }}
                    >
                        Créer un département
                    </Button>

                    {showForm && (
                        <div style={{ 
                            padding: '16px', 
                            border: '1px solid #d9d9d9', 
                            borderRadius: '6px',
                            backgroundColor: '#fafafa'
                        }}>
                            <Title level={5}>
                                {editingDept ? 'Modifier le département' : 'Créer un département'}
                            </Title>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={editingDept ? handleUpdate : handleCreate}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="name"
                                            label="Nom du département"
                                            rules={[{ required: true, message: 'Le nom est requis' }]}
                                        >
                                            <Input placeholder="Ex: Informatique" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="subjectIds"
                                            label="Matières associées"
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Sélectionner les matières"
                                                allowClear
                                            >
                                                {subjects.map(subject => (
                                                    <Option key={subject.id} value={subject.id}>
                                                        {subject.name} ({subject.code})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                    <Button 
                                        onClick={() => setShowForm(false)}
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
                                        type="primary" 
                                        htmlType="submit"
                                        loading={loading}
                                        style={{ 
                                            flex: 1, 
                                            backgroundColor: '#6EADFF', 
                                            borderColor: '#6EADFF' 
                                        }}
                                    >
                                        {editingDept ? 'Modifier' : 'Créer'}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    )}

                    <Table
                        columns={columns}
                        dataSource={departments}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 8 }}
                    />
                </Space>
            </Modal>


        </>
    );
};