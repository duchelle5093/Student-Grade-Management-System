import { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Input, 
    Space, 
    Tag, 
    Select, 
    Tooltip,
    Row,
    Col,
    Typography,
    Modal
} from 'antd';
import { 
    BookOutlined, 
    PlusOutlined, 
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    BankOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { deleteSubject, assignTeacherToSubject } from '../subjects-actions';
import { fetchAllTeachers, fetchAllDepartments } from '../actions';
import { fetchAllSubjects } from '../../subjects';
import { useNotification } from '../../../contexts';
import { SubjectResDto } from '../../../api/reponse-dto/subjects.res.dto';
import { SubjectModal } from './SubjectModal';
import { DepartmentManagementModal } from './DepartmentManagementModal';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const SubjectsManagement = () => {
    const dispatch = useAppDispatch();
    const { allSubjects: subjects = [], loading = false } = useAppSelector(state => state.subjects || {});
    const { teachers = [] } = useAppSelector(state => state.admin || {});
    const { departments = [] } = useAppSelector(state => state.admin || {});
    const { notify } = useNotification();
    
    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
    const [filteredSubjects, setFilteredSubjects] = useState<SubjectResDto[]>([]);
    const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectResDto | null>(null);
    const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<any | null>(null);

    useEffect(() => {
        dispatch(fetchAllSubjects());
        dispatch(fetchAllTeachers());
        dispatch(fetchAllDepartments());
    }, [dispatch]);

    // Filtrer les matières selon le département sélectionné et la recherche
    useEffect(() => {
        let filtered = subjects;

        if (selectedDepartment) {
            filtered = filtered.filter(subject => subject.departmentId === selectedDepartment);
        }

        if (searchText) {
            filtered = filtered.filter(subject =>
                subject.name.toLowerCase().includes(searchText.toLowerCase()) ||
                subject.code.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setFilteredSubjects(filtered);
    }, [subjects, selectedDepartment, searchText]);

    const handleDeleteSubject = (subject: SubjectResDto) => {
        Modal.confirm({
            title: 'Confirmer la suppression',
            content: `Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`,
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: async () => {
                try {
                    const result = await dispatch(deleteSubject(subject.id));
                    if (deleteSubject.fulfilled.match(result)) {
                        notify({
                            type: 'success',
                            message: 'Matière supprimée',
                            description: `${subject.name} a été supprimée avec succès`
                        });
                    }
                } catch (error) {
                    notify({
                        type: 'error',
                        message: 'Erreur de suppression',
                        description: 'Impossible de supprimer la matière'
                    });
                }
            }
        });
    };

    const handleAssignTeacher = async (subjectId: number, teacherId: number) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return;

        try {
            const result = await dispatch(assignTeacherToSubject({ 
                subjectId, 
                teacherId, 
                subjectData: subject 
            }));
            
            if (assignTeacherToSubject.fulfilled.match(result)) {
                const teacher = teachers.find(t => t.id === teacherId);
                notify({
                    type: 'success',
                    message: 'Enseignant assigné',
                    description: `${teacher?.firstName} ${teacher?.lastName} a été assigné à ${subject.name}`
                });
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur d\'assignation',
                description: 'Impossible d\'assigner l\'enseignant'
            });
        }
    };

    const getCompatibleTeachers = (subject: SubjectResDto) => {
        return teachers.filter(teacher => 
            teacher.department === subject.departmentName
        );
    };

    const subjectColumns = [
        {
            title: 'Matière',
            key: 'subject',
            render: (record: SubjectResDto) => (
                <Space direction="vertical" size="small">
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.code} • {record.credits} crédits
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Niveau',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => (
                <Tag color="blue">{level}</Tag>
            ),
        },
        {
            title: 'Cycle',
            dataIndex: 'cycle',
            key: 'cycle',
            render: (cycle: string) => (
                <Tag color="green">{cycle}</Tag>
            ),
        },
        {
            title: 'Enseignant',
            key: 'teacher',
            render: (record: SubjectResDto) => {
                const currentTeacher = teachers.find(t => t.id === record.teacherId);
                
                return currentTeacher ? (
                    <Space>
                        <Tag color="green" icon={<UserOutlined />}>
                            {currentTeacher.firstName} {currentTeacher.lastName}
                        </Tag>
                    </Space>
                ) : (
                    <Tag color="red" icon={<UserOutlined />}>
                        Non assigné
                    </Tag>
                );
            },
        },
        {
            title: 'Statut',
            dataIndex: 'active',
            key: 'active',
            render: (active: boolean, record: SubjectResDto) => {
                const hasTeacher = !!record.teacherId;
                return (
                    <Space direction="vertical" size="small">
                        <Tag color={active ? 'green' : 'red'}>
                            {active ? 'Actif' : 'Inactif'}
                        </Tag>
                        {active && !hasTeacher && (
                            <Tag color="orange" size="small">
                                Sans enseignant
                            </Tag>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (record: SubjectResDto) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />}
                            onClick={() => {
                                setEditingSubject(record);
                                setIsSubjectModalVisible(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDeleteSubject(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
            <Row gutter={24} style={{ height: '100%' }}>
                {/* Colonne Départements */}
                <Col span={8} style={{ height: '100%' }}>
                    <Card
                        title={
                            <Space>
                                <BankOutlined style={{ color: 'white' }} />
                                <Title level={4} style={{ margin: 0, color: 'white' }}>
                                    Départements
                                </Title>
                            </Space>
                        }
                        headStyle={{ backgroundColor: '#6EADFF', borderBottom: 'none' }}
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ 
                            height: 'calc(100% - 57px)', 
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ 
                            position: 'sticky', 
                            top: 0, 
                            zIndex: 10, 
                            backgroundColor: 'white', 
                            padding: '16px 16px 0 16px',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsDepartmentModalVisible(true)}
                                style={{ 
                                    width: '100%', 
                                    marginBottom: '16px',
                                    backgroundColor: '#6EADFF', 
                                    borderColor: '#6EADFF' 
                                }}
                            >
                                Gestion des départements
                            </Button>
                        </div>
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#bfbfbf #ffffff'
                        }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {[...departments].sort((a, b) => 
                                    new Date(b.createdDate || b.createdAt || 0).getTime() - 
                                    new Date(a.createdDate || a.createdAt || 0).getTime()
                                ).map(dept => 
                                    <Button
                                        key={dept.id}
                                        type="default"
                                        block
                                        onClick={() => setSelectedDepartment(dept.id)}
                                        style={{ 
                                            textAlign: 'left', 
                                            height: '55px',
                                            padding: '12px',
                                            backgroundColor: selectedDepartment === dept.id ? 'rgba(110, 173, 255, 0.4)' : '#fafafa',
                                            borderColor: selectedDepartment === dept.id ? 'rgba(110, 173, 255, 0.5)' : '#e8e8e8',
                                            color: selectedDepartment === dept.id ? 'white' : 'rgba(0, 0, 0, 0.88)',
                                            marginBottom: '8px',
                                            transition: 'all 0.2s ease',
                                            fontWeight: selectedDepartment === dept.id ? 'bold' : 'normal'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedDepartment !== dept.id) {
                                                e.currentTarget.style.backgroundColor = '#f0f0f0';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedDepartment !== dept.id) {
                                                e.currentTarget.style.backgroundColor = '#fafafa';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }
                                        }}
                                    >
                                        {dept.name}
                                    </Button>
                                )}
                            </Space>
                        </div>
                    </Card>
                </Col>

                {/* Colonne Matières */}
                <Col span={16} style={{ height: '100%' }}>
                    <Card
                        title={
                            <Space>
                                <BookOutlined style={{ color: 'white' }} />
                                <Title level={4} style={{ margin: 0, color: 'white' }}>
                                    Matières
                                    {selectedDepartment && (
                                        <Text style={{ marginLeft: 8, color: 'rgba(255, 255, 255, 0.8)' }}>
                                            - {departments.find(d => d.id === selectedDepartment)?.name}
                                        </Text>
                                    )}
                                </Title>
                            </Space>
                        }
                        headStyle={{ backgroundColor: '#6EADFF', borderBottom: 'none' }}
                        extra={
                            <Button
                                type="default"
                                icon={<PlusOutlined />}
                                onClick={() => setIsSubjectModalVisible(true)}
                                style={{ backgroundColor: 'white', borderColor: 'white', color: '#6EADFF' , fontWeight: 'bold' }}
                            >
                                Nouvelle Matière
                            </Button>
                        }
                        style={{ height: '100%' }}
                        bodyStyle={{ height: 'calc(100% - 57px)', overflowY: 'auto', padding: '16px' }}
                    >
                        {/* Barre de recherche */}
                        <Row style={{ marginBottom: 16 }}>
                            <Col span={24}>
                                <Search
                                    placeholder="Rechercher par nom ou code..."
                                    allowClear
                                    size="large"
                                    prefix={<SearchOutlined />}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ borderRadius: '8px' }}
                                />
                            </Col>
                        </Row>

                        {/* Tableau des matières */}
                        <Table
                            columns={subjectColumns}
                            dataSource={filteredSubjects}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: false,
                            }}
                            scroll={{ x: true }}
                            rowClassName={(record) => 
                                !record.teacherId ? 'subject-without-teacher' : ''
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/* Modal de création/modification */}
            <SubjectModal
                visible={isSubjectModalVisible}
                onCancel={() => {
                    setIsSubjectModalVisible(false);
                    setEditingSubject(null);
                }}
                onSuccess={() => {
                    setIsSubjectModalVisible(false);
                    setEditingSubject(null);
                    dispatch(fetchAllSubjects());
                }}
                editingSubject={editingSubject}
            />

            {/* Modal de gestion des départements */}
            <DepartmentManagementModal
                visible={isDepartmentModalVisible}
                onCancel={() => {
                    setIsDepartmentModalVisible(false);
                    setEditingDepartment(null);
                }}
            />
        </div>
    );
};