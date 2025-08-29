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
    Checkbox,
    Select,
} from 'antd';
import { 
    UserOutlined, 
    PlusOutlined, 
    SearchOutlined,
    TeamOutlined,
    BookOutlined,
    EditOutlined,
    DeleteOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAllStudents, fetchAllTeachers, deleteUser } from '../actions';
import { CreateUserModal } from './CreateUserModal';
import { ExportModal } from './ExportModal';
import { useNotification } from '../../../contexts';
import {AppButton} from "../../../components";

import { adminReportsService } from '../../../api/configs';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;
const { Search } = Input;

export const UsersManagement = () => {
    const dispatch = useAppDispatch();
    const { students = [], teachers = [], stats = null, loading = false } = useAppSelector(state => state.admin || {});
    const { notify } = useNotification();
    
    // Stats simples calculées directement
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const activeStudents = students.filter(student => student.role === 'STUDENT').length;
    
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('students');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isExportModalVisible, setIsExportModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [generatingTranscripts, setGeneratingTranscripts] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('CC_1');
    const [filterRole] = useState<string>('all');
    const [filterLevel, setFilterLevel] = useState<string>('all');
    const [filterDepartment, setFilterDepartment] = useState<string>('all');
    
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

    const filteredStudents = students.filter(student => {
        const matchesSearch = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(searchText.toLowerCase()) ||
            (student.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (student.username || '').toLowerCase().includes(searchText.toLowerCase());
        
        const matchesRole = filterRole === 'all' || student.role === filterRole;
        const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
        
        return matchesSearch && matchesRole && matchesLevel;
    });
    
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = `${teacher.firstName || ''} ${teacher.lastName || ''}`.toLowerCase().includes(searchText.toLowerCase()) ||
            (teacher.email || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (teacher.username || '').toLowerCase().includes(searchText.toLowerCase());
        
        const matchesDepartment = filterDepartment === 'all' || 
            (teacher.subjects && teacher.subjects.length > 0 && teacher.subjects[0].departmentName === filterDepartment);
        
        return matchesSearch && matchesDepartment;
    });

    useEffect(() => {
        if (selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedStudents, filteredStudents]);

    const handleSelectAll = (e: any) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            const allStudentIds = filteredStudents.map(student => student.studentId || student.id);
            setSelectedStudents(allStudentIds);
        } else {
            setSelectedStudents([]);
        }
    };

    const handleStudentSelect = (studentId: number, checked: boolean) => {
        if (checked) {
            setSelectedStudents(prev => [...prev, studentId]);
        } else {
            setSelectedStudents(prev => prev.filter(id => id !== studentId));
            setSelectAll(false);
        }
    };



    const handleGenerateTranscripts = async () => {
        if (selectedStudents.length === 0) {
            notify({
                type: 'warning',
                message: 'Sélection requise',
                description: 'Veuillez sélectionner au moins un étudiant'
            });
            return;
        }

        setGeneratingTranscripts(true);
        try {
            const selectedStudentData = filteredStudents.filter(student => 
                selectedStudents.includes(student.studentId )
            );
            
            console.log('Selected students data:', selectedStudentData.map(s => ({
                id: s.studentId ,
                name: `${s.firstName} ${s.lastName}`,
                level: s.level,
                username: s.username
            })));

            // Vérifier que tous les étudiants ont un niveau défini
            // const studentsWithoutLevel = selectedStudentData.filter(student => !student.level);
            // if (studentsWithoutLevel.length > 0) {
            //     const studentNames = studentsWithoutLevel.map(s => `${s.firstName} ${s.lastName}`).join(', ');
            //     notify({
            //         type: 'warning',
            //         message: 'Niveau manquant',
            //         description: `Les étudiants suivants n'ont pas de niveau défini : ${studentNames}. Veuillez d'abord définir leur niveau.`
            //     });
            //     setGeneratingTranscripts(false);
            //     return;
            // }

            // Grouper les étudiants par niveau
            const studentsByLevel = selectedStudentData.reduce((acc, student) => {
                const level = student.level;
                if (!acc[level]) acc[level] = [];
                acc[level].push(student.studentId);
                return acc;
            }, {} as Record<string, number[]>);
            
            console.log('Students grouped by level:', studentsByLevel);

            // Générer un PDF pour chaque niveau
            const pdfPromises = Object.entries(studentsByLevel).map(async ([level, studentIds]) => {
                const exportRequest = {
                    documentType: 'transcript',
                    periodLabel: selectedPeriod,
                    studentIds: studentIds,
                    level: level
                };
                
                console.log('Generating transcripts for level:', level, 'students:', studentIds, 'request:', exportRequest);
                const pdfBlob = await adminReportsService.exportPrintTranscripts(exportRequest);
                console.log('PDF generated for level:', level, 'size:', pdfBlob.size, 'bytes');
                return pdfBlob;
            });

            const pdfBlobs = await Promise.all(pdfPromises);
            
            if (pdfBlobs.length === 1) {
                // Un seul niveau : téléchargement direct
                const filename = selectedStudents.length === 1 
                    ? `releve_${selectedStudentData[0]?.username || 'etudiant'}.pdf`
                    : `releves_notes_${selectedStudents.length}_etudiants.pdf`;
                
                saveAs(pdfBlobs[0], filename);
            } else {
                // Plusieurs niveaux : créer un ZIP
                try {
                    const JSZip = (await import('jszip')).default;
                    const zip = new JSZip();
                    
                    Object.keys(studentsByLevel).forEach((level, index) => {
                        const filename = `releves_${level}_${studentsByLevel[level].length}_etudiants.pdf`;
                        zip.file(filename, pdfBlobs[index]);
                    });
                    
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    saveAs(zipBlob, `releves_notes_${selectedStudents.length}_etudiants.zip`);
                } catch (zipError) {
                    console.warn('JSZip not available, downloading PDFs separately');
                    // Fallback: télécharger séparément
                    Object.keys(studentsByLevel).forEach((level, index) => {
                        const filename = `releves_${level}_${studentsByLevel[level].length}_etudiants.pdf`;
                        setTimeout(() => saveAs(pdfBlobs[index], filename), index * 500);
                    });
                }
            }



            notify({
                type: 'success',
                message: 'Relevés générés',
                description: `${selectedStudents.length} relevé(s) de notes généré(s) avec succès`
            });

            setSelectedStudents([]);
            setSelectAll(false);
        } catch (error) {
            console.error('Erreur génération relevés:', error);
            notify({
                type: 'error',
                message: 'Erreur de génération',
                description: 'Impossible de générer les relevés de notes. Vérifiez que les étudiants ont des notes.'
            });
        } finally {
            setGeneratingTranscripts(false);
        }
    };

    const studentColumns = [
        {
            title: (
                <Checkbox 
                    checked={selectAll}
                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length}
                    onChange={handleSelectAll}
                />
            ),
            key: 'select',
            width: 50,
            render: (record: any) => (
                <Checkbox
                    checked={selectedStudents.includes(record.studentId || record.id)}
                    onChange={(e) => handleStudentSelect(record.studentId || record.id, e.target.checked)}
                />
            ),
        },
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
                    rowKey={(record) => record.studentId}
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
                    dataSource={filteredTeachers}
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
                            value={totalStudents + totalTeachers}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Étudiants"
                            value={totalStudents}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Enseignants"
                            value={totalTeachers}
                            prefix={<BookOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Actifs"
                            value={activeStudents}
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
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        {activeTab === 'students' && selectedStudents.length > 0 && (
                            <Space size="middle">
                                <Text strong style={{ color: '#1890ff' }}>
                                    {selectedStudents.length} étudiant(s) sélectionné(s)
                                </Text>
                                <Select
                                    value={selectedPeriod}
                                    onChange={setSelectedPeriod}
                                    style={{ width: 140 }}
                                    placeholder="Choisir période"
                                >
                                    <Select.Option value="CC_1">CC Semestre 1</Select.Option>
                                    <Select.Option value="SN_1">SN Semestre 1</Select.Option>
                                    <Select.Option value="CC_2">CC Semestre 2</Select.Option>
                                    <Select.Option value="SN_2">SN Semestre 2</Select.Option>
                                </Select>
                                <Button
                                    type="primary"
                                    icon={<FilePdfOutlined />}
                                    loading={generatingTranscripts}
                                    onClick={handleGenerateTranscripts}
                                    size="large"
                                    style={{ 
                                        backgroundColor: '#ff4d4f', 
                                        borderColor: '#ff4d4f',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Générer Relevés ({selectedStudents.length})
                                </Button>
                            </Space>
                        )}
                    </Col>
                    <Col>
                        <AppButton
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                            size="large"
                        >
                            Nouvel Utilisateur
                        </AppButton>
                    </Col>
                </Row>

                {/* Barre de recherche et aide */}
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Search
                                        placeholder="Rechercher par nom, email ou username..."
                                        allowClear
                                        size="large"
                                        prefix={<SearchOutlined />}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Space>
                                        {activeTab === 'students' && (
                                            <>
                                                <Select
                                                    value={filterLevel}
                                                    onChange={setFilterLevel}
                                                    style={{ width: 120 }}
                                                    size="large"
                                                >
                                                    <Select.Option value="all">Tous niveaux</Select.Option>
                                                    <Select.Option value="LEVEL1">Licence 1</Select.Option>
                                                    <Select.Option value="LEVEL2">Licence 2</Select.Option>
                                                    <Select.Option value="LEVEL3">Licence 3</Select.Option>
                                                    <Select.Option value="LEVEL4">Master 1</Select.Option>
                                                    <Select.Option value="LEVEL5">Master 2</Select.Option>
                                                </Select>
                                            </>
                                        )}
                                        {activeTab === 'teachers' && (
                                            <Select
                                                value={filterDepartment}
                                                onChange={setFilterDepartment}
                                                style={{ width: 150 }}
                                                size="large"
                                                placeholder="Département"
                                            >
                                                <Select.Option value="all">Tous départements</Select.Option>
                                                <Select.Option value="Computer Science">Computer Science</Select.Option>
                                                <Select.Option value="Mathematics">Mathematics</Select.Option>
                                                <Select.Option value="Engineering">Engineering</Select.Option>
                                            </Select>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                            {activeTab === 'students' && selectedStudents.length === 0 && (
                                <div style={{ 
                                    padding: '12px 16px', 
                                    backgroundColor: '#f0f9ff', 
                                    border: '1px solid #bae7ff',
                                    borderRadius: '6px',
                                    color: '#1890ff'
                                }}>
                                    <Text style={{ fontSize: '14px' }}>
                                        📝 Sélectionnez un ou plusieurs étudiants pour générer leurs relevés de notes
                                    </Text>
                                </div>
                            )}
                        </Space>
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
                onSuccess={(newUser) => {
                    setIsCreateModalVisible(false);
                    setEditingUser(null);
                    // Pas de refresh complet - le store est mis à jour automatiquement
                }}
                editingUser={editingUser}
            />
            
            <ExportModal
                visible={isExportModalVisible}
                onCancel={() => setIsExportModalVisible(false)}
            />
        </div>
    );
};