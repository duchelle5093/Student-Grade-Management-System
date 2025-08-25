import React from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    List,
    Avatar,
    Tag,
    Empty
} from 'antd';
import {
    BookOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../store';
import { useTeacherLevels } from '../../hooks';

const { Title, Text } = Typography;

export const TeacherOverview = () => {
    const { profile } = useAppSelector(state => state.user);
    const { 
        allTeacherLevels,
        licenceLevelsCount,
        masterLevelsCount,
        totalLevelsCount
    } = useTeacherLevels();

    const recentActivity = [
        { type: 'grade', name: 'Mathématiques L1', action: 'Notes saisies pour CC_1', time: '2h', avatar: 'M' },
        { type: 'grade', name: 'Algèbre L2', action: 'Notes saisies pour SN_1', time: '1 jour', avatar: 'A' },
        { type: 'claim', name: 'Réclamation', action: 'Nouvelle réclamation reçue', time: '2 jours', avatar: 'R' }
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0, color: '#262626' }}>
                    Tableau de bord Enseignant
                </Title>
                <Text type="secondary">
                    Bienvenue {profile?.firstName} {profile?.lastName}
                </Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic
                            title="Niveaux enseignés"
                            value={totalLevelsCount}
                            prefix={<BookOutlined style={{ color: '#6EADFF' }} />}
                            valueStyle={{ color: '#6EADFF', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic
                            title="Niveaux Licence"
                            value={licenceLevelsCount}
                            prefix={<TeamOutlined style={{ color: '#36CFC9' }} />}
                            valueStyle={{ color: '#36CFC9', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic
                            title="Niveaux Master"
                            value={masterLevelsCount}
                            prefix={<TrophyOutlined style={{ color: '#B37FEB' }} />}
                            valueStyle={{ color: '#B37FEB', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <Statistic
                            title="Réclamations"
                            value={0}
                            prefix={<CheckCircleOutlined style={{ color: '#FF85C0' }} />}
                            valueStyle={{ color: '#FF85C0', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Mes niveaux d'enseignement" 
                        style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        headStyle={{ borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}
                    >
                        {allTeacherLevels.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={allTeacherLevels}
                                renderItem={(level) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar 
                                                    style={{ 
                                                        backgroundColor: level.level.startsWith('L') ? '#6EADFF' : '#B37FEB'
                                                    }}
                                                >
                                                    {level.level}
                                                </Avatar>
                                            }
                                            title={<Text strong>{level.displayName}</Text>}
                                            description={
                                                <Tag color={level.level.startsWith('L') ? 'blue' : 'purple'}>
                                                    {level.level.startsWith('L') ? 'Licence' : 'Master'}
                                                </Tag>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty 
                                description="Aucun niveau assigné"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card 
                        title="Activité récente" 
                        style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        headStyle={{ borderBottom: '1px solid #f0f0f0', fontWeight: 'bold' }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={recentActivity}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar 
                                                style={{ 
                                                    backgroundColor: 
                                                        item.type === 'grade' ? '#36CFC9' :
                                                        item.type === 'claim' ? '#ff4d4f' : '#B37FEB'
                                                }}
                                            >
                                                {item.avatar}
                                            </Avatar>
                                        }
                                        title={<Text strong>{item.name}</Text>}
                                        description={
                                            <div>
                                                <Text type="secondary">{item.action}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    <ClockCircleOutlined /> Il y a {item.time}
                                                </Text>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {totalLevelsCount === 0 && (
                <Row style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                            <Empty 
                                description={
                                    <div>
                                        <Text type="secondary">Aucun niveau d'enseignement assigné</Text>
                                        <br />
                                        <Text type="secondary">Contactez l'administrateur pour obtenir vos assignations</Text>
                                    </div>
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};