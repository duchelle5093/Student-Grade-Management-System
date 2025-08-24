import { useState, useEffect } from 'react';
import { 
    Card, 
    Table, 
    Button, 
    Input, 
    Space, 
    Tag, 
    Avatar, 
    Tooltip,
    Row,
    Col,
    Statistic,
    Typography,
    Tabs,
    Modal,
} from 'antd';
import { 
    UserOutlined, 
    PlusOutlined, 
    SearchOutlined,
    TeamOutlined,
    BookOutlined,
    DownloadOutlined,
    EditOutlined,
    DeleteOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAllStudents, fetchAllTeachers, deleteUser } from '../actions';
import { CreateUserModal } from './CreateUserModal';
import { useNotification } from '../../../contexts';
import {AppButton} from "../../../components";

const { Title, Text } = Typography;
const { Search } = Input;

export const UsersManagement = () => {
    const dispatch = useAppDispatch();
    const { students = [], teachers = [], stats = null, loading = false } = useAppSelector(state => state.admin || {});
    const { notify } = useNotification();
    
    // Générer les statistiques à partir des données réelles
    const generateStats = () => {
        const totalStudents = students.length;
        const activeStudents = students.filter(student => student.role === 'STUDENT').length;
        const totalTeachers = teachers.length;
        
        return {
            totalStudents,
            totalTeachers,
            activeStudents,
            studentsPerLevel: [],
            subjectsPerDepartment: []
        };
    };
    
    const computedStats = generateStats();
    
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('students');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    const handleEditUser = (user: any) => {
        console.log('User to edit:', user); // Debug
        setEditingUser(user);
        setIsCreateModalVisible(true);
    };
    
    const handleDeleteUser = (user: any) => {
        const userId = user.studentId || user.id;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const userName = firstName && lastName ? `${firstName} ${lastName}` : user.username || user.email || `Utilisateur #${userId}`;
        
        Modal.confirm({
            title: 'Confirmer la suppression',
            content: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?
Cette action est irréversible.`,
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: async () => {
                try {
                    const result = await dispatch(deleteUser(userId));
                    if (deleteUser.fulfilled.match(result)) {
                        notify({
                            type: 'success',
                            message: 'Utilisateur supprimé',
                            description: `${userName} a été supprimé avec succès`
                        });
                    } else {
                        notify({
                            type: 'error',
                            message: 'Erreur de suppression',
                            description: 'Impossible de supprimer l\'utilisateur'
                        });
                    }
                } catch (error) {
                    notify({
                        type: 'error',
                        message: 'Erreur de suppression',
                        description: 'Impossible de supprimer l\'utilisateur'
                    });
                }
            }
        });
    };


    useEffect(() => {
        dispatch(fetchAllStudents());
        dispatch(fetchAllTeachers());
    }, [dispatch]);

    const filteredStudents = students.filter(student =>
        `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(searchText.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (student.username || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const studentColumns = [
        {
            title: 'Utilisateur',
            key: 'user',
            sorter: (a: any, b: any) => {
                const nameA = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
                const nameB = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
                return nameA.localeCompare(nameB);
            },
            render: (record: any) => (
                <Space>
                    <Avatar 
                        size="large" 
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<UserOutlined />}
                    >
                        {record.firstName?.[0] || ''}{record.lastName?.[0] || ''}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {record.firstName || ''} {record.lastName || ''}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            @{record.username || ''}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: any, b: any) => (a.email || '').localeCompare(b.email || ''),
            render: (email: string) => email || '-',
        },
        {
            title: 'Niveau',
            dataIndex: 'level',
            key: 'level',
            sorter: (a: any, b: any) => (a.level || '').localeCompare(b.level || ''),
            render: (level: string) => (
                <Tag color="blue">{level || 'Non défini'}</Tag>
            ),
        },
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
            sorter: (a: any, b: any) => (a.role || '').localeCompare(b.role || ''),
            render: (role: string) => (
                <Tag color={role === 'STUDENT' ? 'green' : role === 'TEACHER' ? 'orange' : 'red'}>
                    {role === 'STUDENT' ? 'Étudiant' : role === 'TEACHER' ? 'Enseignant' : 'Admin'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (record: any) => (
                <Space>
                    <Tooltip title="Modifier">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={() => handleEditUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDeleteUser(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const tabItems = [
        {
            key: 'students',
            label: (

                    <Space style={{ 
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: activeTab === 'students' ? '#e6f7ff' : 'transparent',
                        border: activeTab === 'students' ? '1px solid #1890ff' : '1px solid transparent'
                    }}>
                        <TeamOutlined style={{ color: activeTab === 'students' ? '#1890ff' : '#666' }} />
                        <span style={{ color: activeTab === 'students' ? '#1890ff' : '#666', fontWeight: activeTab === 'students' ? 'bold' : 'normal' }}>
                            Étudiants
                        </span>
                    </Space>
            ),
            children: (
                <Table
                    columns={studentColumns}
                    dataSource={filteredStudents}
                    rowKey={(record) => record.studentId || record.id}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: false,
                    }}
                    style={{ marginTop: 16 }}
                    scroll={{ x: true }}
                    showSorterTooltip={false}
                />
            ),
        },
        {
            key: 'teachers',
            label: (

                    <Space style={{ 
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: activeTab === 'teachers' ? '#e6f7ff' : 'transparent',
                        border: activeTab === 'teachers' ? '1px solid #1890ff' : '1px solid transparent'
                    }}>
                        <BookOutlined style={{ color: activeTab === 'teachers' ? '#1890ff' : '#666' }} />
                        <span style={{ color: activeTab === 'teachers' ? '#1890ff' : '#666', fontWeight: activeTab === 'teachers' ? 'bold' : 'normal' }}>
                            Enseignants
                        </span>
                    </Space>
            ),
            children: (
                <Table
                    columns={studentColumns}
                    dataSource={teachers}
                    rowKey={(record) => record.id}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: false,
                    }}
                    style={{ marginTop: 16 }}
                    scroll={{ x: true }}
                    showSorterTooltip={false}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header avec statistiques */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Utilisateurs"
                            value={(stats?.totalStudents || computedStats.totalStudents) + (stats?.totalTeachers || computedStats.totalTeachers)}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Étudiants"
                            value={stats?.totalStudents || computedStats.totalStudents}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Enseignants"
                            value={stats?.totalTeachers || computedStats.totalTeachers}
                            prefix={<BookOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Actifs"
                            value={stats?.activeStudents || computedStats.activeStudents}
                            prefix={<TeamOutlined style={{ color: '#13c2c2' }} />}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Carte principale */}
            <Card
                title={
                    <Space>
                        <TeamOutlined />
                        <Title level={4} style={{ margin: 0 }}>
                            Gestion des Utilisateurs
                        </Title>
                    </Space>
                }

                style={{ 
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                {/* Boutons d'action */}
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <Space>
                            <AppButton
                                icon={<DownloadOutlined />}
                            >
                                Exporter
                            </AppButton>
                            <AppButton
                                icon={<PlusOutlined />}
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Nouvel Utilisateur
                            </AppButton>
                        </Space>
                    </Col>
                </Row>

                {/* Barre de recherche */}
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <Search
                            placeholder="Rechercher par nom, email ou username..."
                            allowClear
                            size="large"
                            prefix={<SearchOutlined />}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ borderRadius: '8px' }}
                        />
                    </Col>
                </Row>

                {/* Onglets */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="large"
                />
            </Card>

            {/* Modals */}
            <CreateUserModal
                visible={isCreateModalVisible}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    setEditingUser(null);
                }}
                onSuccess={() => {
                    setIsCreateModalVisible(false);
                    setEditingUser(null);
                    dispatch(fetchAllStudents());
                    dispatch(fetchAllTeachers());
                }}
                editingUser={editingUser}
            />
        </div>
    );
};