import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Typography, Tabs } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {AppButton} from "../../components";

const { Title, Text } = Typography;

interface AcademicPeriod {
    id: string;
    name: string;
    shortName: string;
    type: 'CC' | 'SN';
    semester: 1 | 2;
    startDate: string;
    endDate: string;
    color: string;
    isActive: boolean;
    order: number;
}

const AcademicPeriodsManager = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod | null>(null);
    const [activeTab, setActiveTab] = useState('start');
    const [calendarDate, setCalendarDate] = useState('2020-12-01');

    // Données simulées du backend
    const periods = [
            {
                id: 'cc1',
                name: 'Contrôle continu #1',
                shortName: 'CC #1',
                type: 'CC' as const,
                semester: 1,
                startDate: '2020-10-01',
                endDate: '2020-11-28',
                color: '#FF8A95',
                isActive: false,
                order: 1
            },
            {
                id: 'sn1',
                name: 'Session normale #1',
                shortName: 'SN #1',
                type: 'SN' as const,
                semester: 1,
                startDate: '2020-11-28',
                endDate: '2021-02-02',
                color: '#FFB366',
                isActive: false,
                order: 2
            },
            {
                id: 'cc2',
                name: 'Contrôle continu #2',
                shortName: 'CC #2',
                type: 'CC' as const,
                semester: 2,
                startDate: '2021-02-02',
                endDate: '2021-03-15',
                color: '#B19CD9',
                isActive: false,
                order: 3
            },
            {
                id: 'sn2',
                name: 'Session normale #2',
                shortName: 'SN #2',
                type: 'SN' as const,
                semester: 2,
                startDate: '2021-03-15',
                endDate: '2021-06-25',
                color: '#A8D982',
                isActive: true,
                order: 4
            }
        ];

    const months = [
        { name: 'Oct', bg: '#E5E7EB' },
        { name: 'Nov', bg: '#E5E7EB' },
        { name: 'Déc', bg: '#DBEAFE' },
        { name: 'Jan', bg: '#DBEAFE' },
        { name: 'Fév', bg: '#DBEAFE' },
        { name: 'Mar', bg: '#E5E7EB' },
        { name: 'Avr', bg: '#E5E7EB' },
        { name: 'Mai', bg: '#E5E7EB' },
        { name: 'Juin', bg: '#E5E7EB' }
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        return `${day} ${monthNames[date.getMonth()]}`;
    };

    const calculatePosition = (dateStr: string) => {
        const date = new Date(dateStr);
        const startYear = new Date(2020, 9, 1);
        const endYear = new Date(2021, 5, 30);
        const totalDuration = endYear.getTime() - startYear.getTime();
        const elapsed = date.getTime() - startYear.getTime();
        return Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    };

    const calculateWidth = (startDate: string, endDate: string) => {
        const startPos = calculatePosition(startDate);
        const endPos = calculatePosition(endDate);
        return endPos - startPos;
    };

    const handlePeriodClick = (period: AcademicPeriod) => {
        setSelectedPeriod(period);
        setIsModalVisible(true);
        // Définir la date du calendrier selon la période
        const periodDate = new Date(period.startDate);
        setCalendarDate(`${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}-01`);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedPeriod(null);
        setActiveTab('start');
    };

    const handleModalConfirm = () => {
        // Logique de sauvegarde ici
        console.log('Sauvegarde de la période:', selectedPeriod);
        setIsModalVisible(false);
        setSelectedPeriod(null);
        setActiveTab('start');
    };

    const getCalendarEvents = () => {
        if (!selectedPeriod) return [];
        
        const events = [
            {
                id: `end-${selectedPeriod.id}`,
                title: `Fin de ${selectedPeriod.shortName}`,
                start: selectedPeriod.endDate,
                backgroundColor: selectedPeriod.color,
                borderColor: selectedPeriod.color,
                textColor: '#000'
            }
        ];

        // Ajouter le début de la période suivante
        const nextPeriod = periods.find(p => p.order === selectedPeriod.order + 1);
        if (nextPeriod) {
            events.push({
                id: `start-${nextPeriod.id}`,
                title: `Début ${nextPeriod.shortName}`,
                start: nextPeriod.startDate,
                backgroundColor: nextPeriod.color,
                borderColor: nextPeriod.color,
                textColor: '#000'
            });
        }

        return events;
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
            {/* Section principale */}
            <div style={{ flex: 1, padding: '24px', backgroundColor: 'white', position: 'relative' }}>
                {/* En-tête */}
                <div style={{ marginBottom: '32px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Période en cours</Text>
                    <Title level={3} style={{ color: '#1890ff', margin: '4px 0' }}>
                        {periods.find(p => p.isActive)?.name || 'Aucune période active'}
                    </Title>
                    <Text style={{ color: '#666' }}>
                        {periods.find(p => p.isActive) ? `${formatDate(periods.find(p => p.isActive)!.startDate)} - ${formatDate(periods.find(p => p.isActive)!.endDate)}` : ''}
                    </Text>
                </div>

                {/* Timeline Container */}
                <div style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    position: 'relative',
                }}>
                    {/* Icône graduation */}
                    <div style={{
                        position: 'absolute',
                        left: '24px',
                        top: '24px',
                        zIndex: 10
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: 'white',
                            border: '4px solid #d9d9d9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <svg width="32" height="32" fill="#fa8c16" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                            </svg>
                        </div>
                    </div>

                    {/* En-têtes des mois */}
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '128px' }}></div>
                        {months.map((month) => (
                            <div
                                key={month.name}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '16px 0',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#666',
                                    backgroundColor: month.bg,
                                    borderRight: '1px solid #f0f0f0'
                                }}
                            >
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Marqueurs de dates */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ width: '128px', backgroundColor: '#fafafa' }}></div>
                        <div style={{ flex: 1, position: 'relative', height: '48px' }}>
                            {/* Marqueurs dynamiques basés sur les périodes */}
                            {periods.map((period) => [
                                <div key={`start-${period.id}`} style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.startDate)}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>{new Date(period.startDate).getDate()}</div>,
                                <div key={`end-${period.id}`} style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.endDate)}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>{new Date(period.endDate).getDate()}</div>
                            ]).flat()}
                        </div>
                    </div>

                    {/* Barres des périodes */}
                    {periods.map((period) => (
                        <div key={period.id} style={{ display: 'flex', height: '130px' }}>
                            <div style={{
                                width: '128px',
                                padding: '16px 12px',
                                backgroundColor: '#fafafa',
                                fontSize: '15px',
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: '1px solid #f0f0f0',
                                fontWeight: 'bold'
                            }}>
                                {period.name}
                            </div>
                            <div style={{ 
                                flex: 1, 
                                position: 'relative', 
                                borderBottom: '1px solid #f0f0f0',
                                backgroundColor: period.isActive ? '#e6f7ff' : 'white'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.startDate)}%`,
                                    width: `${calculateWidth(period.startDate, period.endDate)}%`,
                                    height: '100px',
                                    backgroundColor: period.color,
                                    borderRadius: '4px',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar droite */}
            <div style={{
                width: '300px',
                backgroundColor: 'white',
                borderLeft: '1px solid #f0f0f0',
                padding: '24px'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <AppButton
                        btnType={'submit'}
                        icon={<EditOutlined />}
                        onClick={() => {
                            const activePeriod = periods.find(p => p.isActive);
                            if (activePeriod) handlePeriodClick(activePeriod);
                        }}
                    >
                        Éditer la période en cours
                    </AppButton>
                </div>
                
                {periods.map((period) => (
                    <div 
                        key={period.id} 
                        onClick={() => handlePeriodClick(period)}
                        style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #f0f0f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: period.color,
                                borderRadius: '2px'
                            }}></div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>
                                {period.shortName}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
                            {formatDate(period.startDate)} - {formatDate(period.endDate)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal d'édition */}
            <Modal
                title={`Édition date de la période du ${selectedPeriod?.shortName || 'CC#1'}`}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Annuler
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleModalConfirm}>
                        Confirmer
                    </Button>
                ]}
                width={800}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <Tabs.TabPane tab="Date de début" key="start">
                        <div style={{ marginBottom: '16px' }}>
                            <Select defaultValue="16" style={{ width: 80, marginRight: 8 }}>
                                {Array.from({length: 31}, (_, i) => (
                                    <Select.Option key={i+1} value={i+1}>{i+1}</Select.Option>
                                ))}
                            </Select>
                            <Select defaultValue="Déc" style={{ width: 80, marginRight: 8 }}>
                                <Select.Option value="Oct">Oct</Select.Option>
                                <Select.Option value="Nov">Nov</Select.Option>
                                <Select.Option value="Déc">Déc</Select.Option>
                                <Select.Option value="Jan">Jan</Select.Option>
                                <Select.Option value="Fév">Fév</Select.Option>
                                <Select.Option value="Mar">Mar</Select.Option>
                                <Select.Option value="Avr">Avr</Select.Option>
                                <Select.Option value="Mai">Mai</Select.Option>
                                <Select.Option value="Juin">Juin</Select.Option>
                            </Select>
                            <Select defaultValue="2025" style={{ width: 80 }}>
                                <Select.Option value="2025">2025</Select.Option>
                                <Select.Option value="2026">2026</Select.Option>
                                <Select.Option value="2027">2027</Select.Option>
                            </Select>
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Date de fin" key="end">
                        <div style={{ marginBottom: '16px' }}>
                            <Select defaultValue="28" style={{ width: 80, marginRight: 8 }}>
                                {Array.from({length: 31}, (_, i) => (
                                    <Select.Option key={i+1} value={i+1}>{i+1}</Select.Option>
                                ))}
                            </Select>
                            <Select defaultValue="Nov" style={{ width: 80, marginRight: 8 }}>
                                <Select.Option value="Oct">Oct</Select.Option>
                                <Select.Option value="Nov">Nov</Select.Option>
                                <Select.Option value="Déc">Déc</Select.Option>
                                <Select.Option value="Jan">Jan</Select.Option>
                                <Select.Option value="Fév">Fév</Select.Option>
                                <Select.Option value="Mar">Mar</Select.Option>
                                <Select.Option value="Avr">Avr</Select.Option>
                                <Select.Option value="Mai">Mai</Select.Option>
                                <Select.Option value="Juin">Juin</Select.Option>
                            </Select>
                            <Select defaultValue="2026" style={{ width: 80 }}>
                                <Select.Option value="2025">2025</Select.Option>
                                <Select.Option value="2026">2026</Select.Option>
                                <Select.Option value="2027">2027</Select.Option>
                            </Select>
                        </div>
                    </Tabs.TabPane>
                </Tabs>
                
                <div style={{ marginTop: '16px', height: '400px' }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={calendarDate}
                        events={getCalendarEvents()}
                        headerToolbar={{
                            left: 'prev',
                            center: 'title',
                            right: 'next'
                        }}
                        locale="fr"
                        height="100%"
                        dayCellClassNames={(date) => {
                            if (!selectedPeriod) return '';
                            const cellDate = date.date;
                            const startDate = new Date(selectedPeriod.startDate);
                            const endDate = new Date(selectedPeriod.endDate);
                            return cellDate >= startDate && cellDate <= endDate ? 'selected-range' : '';
                        }}
                    />
                </div>
                
                <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                    Période du {selectedPeriod?.name.toLowerCase() || 'contrôle continu #1'} du {selectedPeriod ? formatDate(selectedPeriod.startDate) : '1 oct'} - {selectedPeriod ? formatDate(selectedPeriod.endDate) : '28 Nov'}
                </div>
            </Modal>

            <style>{`
                body {
                    overflow: hidden !important;
                }
                .selected-range {
                    background-color: #e6f7ff !important;
                }
                .fc-day-today {
                    background-color: transparent !important;
                }
            `}</style>
        </div>
    );
};

export default AcademicPeriodsManager;