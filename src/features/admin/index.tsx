import  { useState, useEffect } from 'react';
import { Button, Modal,Typography, Tabs, DatePicker} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppButton } from "../../components";
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAllGradingWindows, updateGradingWindow } from './grading-windows-actions';
import { useNotification } from '../../contexts';
import { SemesterManagement } from './components/SemesterManagement';
import dayjs from 'dayjs';

// Hook pour gérer le responsive
const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return { isMobile };
};

const { Title, Text } = Typography;

interface AcademicPeriod {
    id: string;
    name: string;
    shortName: string;
    type: 'CC_1' | 'SN_1' |'CC_2' | 'SN_2';
    semester: 1 | 2;
    startDate: string;
    endDate: string;
    color: string;
    isActive: boolean;
    order: number;
}

const AcademicPeriodsManager = () => {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const { loading, gradingWindows } = useAppSelector(state => state.admin);
    const { isMobile } = useResponsive();
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<AcademicPeriod | null>(null);
    const [activeTab, setActiveTab] = useState('start');
    const [calendarDate, setCalendarDate] = useState('2020-12-01');
    const [editedStartDate, setEditedStartDate] = useState<string>('');
    const [editedEndDate, setEditedEndDate] = useState<string>('');
    const [isSemesterModalVisible, setIsSemesterModalVisible] = useState(false);
    
    // Données mockées (fallback uniquement)
    const mockPeriods = [
            {
                id: 'cc1',
                name: 'Contrôle continu #1',
                shortName: 'CC_1',
                type: 'CC_1' as const,
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
                shortName: 'SN_1',
                type: 'SN_1' as const,
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
                shortName: 'CC_2',
                type: 'CC_2' as const,
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
                shortName: 'SN_2',
                type: 'SN_2' as const,
                semester: 2,
                startDate: '2021-03-15',
                endDate: '2021-06-25',
                color: '#A8D982',
                isActive: true,
                order: 4
            }
        ];
    
    // Charger les périodes du backend
    useEffect(() => {
        dispatch(fetchAllGradingWindows());
    }, [dispatch]);
    
    // Mapper les données backend vers le format AcademicPeriod
    const backendPeriods: AcademicPeriod[] = gradingWindows.map(period => ({
        id: period.id.toString(),
        name: period.name,
        shortName: period.shortName,
        type: (period.shortName || period.shortName) as 'CC_1' | 'SN_1' | 'CC_2' | 'SN_2',
        semester: period.semester,
        startDate: period.startDate,
        endDate: period.endDate,
        color: period.color === 'string' ? '#1890ff' : (period.color || '#1890ff'),
        isActive: period.isActive,
        order: period.order
    }));
    
    // Utiliser les données backend ou fallback vers mock
    const periods = backendPeriods.length > 0 ? backendPeriods : mockPeriods;

    // Générer une année académique standard (9 mois)
    const months = [
        { name: 'Sep', bg: '#E5E7EB' },
        { name: 'Oct', bg: '#E5E7EB' },
        { name: 'Nov', bg: '#E5E7EB' },
        { name: 'Déc', bg: '#E5E7EB' },
        { name: 'Jan', bg: '#DBEAFE' },
        { name: 'Fév', bg: '#DBEAFE' },
        { name: 'Mar', bg: '#DBEAFE' },
        { name: 'Avr', bg: '#DBEAFE' },
        { name: 'Mai', bg: '#DBEAFE' },
        { name: 'Juin', bg: '#DBEAFE' }
    ];

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        return `${day} ${monthNames[date.getMonth()]}`;
    };

    const calculatePosition = (dateStr: string) => {
        const date = new Date(dateStr);
        // Année académique : Sep année N à Juin année N+1
        const currentYear = new Date().getFullYear();
        const startYear = new Date(currentYear, 8, 1); // 1er septembre
        const endYear = new Date(currentYear + 1, 5, 30); // 30 juin
        
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
        setEditedStartDate(period.startDate);
        setEditedEndDate(period.endDate);
        setIsModalVisible(true);
        // Définir la date du calendrier selon la période
        const periodDate = new Date(period.startDate);
        setCalendarDate(`${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}-01`);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedPeriod(null);
        setActiveTab('start');
        setEditedStartDate('');
        setEditedEndDate('');
    };

    const handleModalConfirm = async () => {
        if (!selectedPeriod) return;
        
        // Validation des contraintes d'ordre
        const newStartDate = new Date(editedStartDate);
        const newEndDate = new Date(editedEndDate);
        
        if (newStartDate >= newEndDate) {
            notify({
                type: 'error',
                message: 'Dates invalides',
                description: 'La date de début doit être antérieure à la date de fin'
            });
            return;
        }
        
        // Trouver la période précédente et suivante selon l'ordre
        const previousPeriod = periods.find(p => p.order === selectedPeriod.order - 1);
        const nextPeriod = periods.find(p => p.order === selectedPeriod.order + 1);
        
        // Vérifier contrainte avec période précédente
        if (previousPeriod) {
            const prevEndDate = new Date(previousPeriod.endDate);
            if (newStartDate < prevEndDate) {
                notify({
                    type: 'error',
                    message: 'Contrainte d\'ordre violée',
                    description: `La date de début ne peut pas être antérieure à la fin de ${previousPeriod.shortName} (${formatDate(previousPeriod.endDate)})`
                });
                return;
            }
        }
        
        // Vérifier contrainte avec période suivante
        if (nextPeriod) {
            const nextStartDate = new Date(nextPeriod.startDate);
            if (newEndDate > nextStartDate) {
                notify({
                    type: 'error',
                    message: 'Contrainte d\'ordre violée',
                    description: `La date de fin ne peut pas être postérieure au début de ${nextPeriod.shortName} (${formatDate(nextPeriod.startDate)})`
                });
                return;
            }
        }
        
        try {
            const payload = {
                semesterId: selectedPeriod.semester,
                name: selectedPeriod.name,
                shortName: selectedPeriod.shortName,
                periodLabel: selectedPeriod.shortName,
                startDate: editedStartDate,
                endDate: editedEndDate,
                color: selectedPeriod.color,
                isActive: selectedPeriod.isActive,
                order: selectedPeriod.order
            };
            
            await dispatch(updateGradingWindow({ 
                id: parseInt(selectedPeriod.id), 
                windowData: payload 
            })).unwrap();
            
            notify({
                type: 'success',
                message: 'Période mise à jour',
                description: `La période ${selectedPeriod.shortName} a été modifiée avec succès`
            });
            
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur de mise à jour',
                description: 'Impossible de modifier la période'
            });
        }
        
        setIsModalVisible(false);
        setSelectedPeriod(null);
        setActiveTab('start');
        setEditedStartDate('');
        setEditedEndDate('');
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
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            height: '100vh', 
            backgroundColor: '#f5f5f5', 
            overflow: 'hidden' 
        }}>
            {/* Section principale */}
            <div style={{ 
                flex: 1, 
                padding: window.innerWidth < 768 ? '16px' : '24px', 
                backgroundColor: 'white', 
                position: 'relative',
                minHeight: window.innerWidth < 768 ? '60vh' : 'auto'
            }}>
                {/* En-tête */}
                <div style={{ marginBottom: window.innerWidth < 768 ? '16px' : '32px' }}>
                    <Text type="secondary" style={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }}>Période en cours</Text>
                    <Title level={window.innerWidth < 768 ? 4 : 3} style={{ color: '#1890ff', margin: '4px 0' }}>
                        {periods.find(p => p.isActive)?.name || 'Aucune période active'}
                    </Title>
                    <Text style={{ color: '#666', fontSize: window.innerWidth < 768 ? '12px' : '14px' }}>
                        {periods.find(p => p.isActive) ? `${formatDate(periods.find(p => p.isActive)!.startDate)} - ${formatDate(periods.find(p => p.isActive)!.endDate)}` : ''}
                    </Text>
                </div>

                {/* Timeline Container */}
                <div style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    overflow: window.innerWidth < 768 ? 'auto' : 'hidden',
                    backgroundColor: 'white',
                    position: 'relative',
                    minWidth: window.innerWidth < 768 ? '600px' : 'auto'
                }}>
                    {/* Icône graduation */}
                    <div style={{
                        position: 'absolute',
                        left: window.innerWidth < 768 ? '12px' : '24px',
                        top: window.innerWidth < 768 ? '12px' : '24px',
                        zIndex: 10
                    }}>
                        <div style={{
                            width: window.innerWidth < 768 ? '48px' : '64px',
                            height: window.innerWidth < 768 ? '48px' : '64px',
                            backgroundColor: 'white',
                            border: '4px solid #d9d9d9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <svg width={window.innerWidth < 768 ? "24" : "32"} height={window.innerWidth < 768 ? "24" : "32"} fill="#fa8c16" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                            </svg>
                        </div>
                    </div>

                    {/* En-têtes des mois */}
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: window.innerWidth < 768 ? '100px' : '128px' }}></div>
                        {months.map((month) => (
                            <div
                                key={month.name}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: window.innerWidth < 768 ? '8px 0' : '16px 0',
                                    fontSize: window.innerWidth < 768 ? '12px' : '14px',
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
                        <div style={{ width: window.innerWidth < 768 ? '100px' : '128px', backgroundColor: '#fafafa' }}></div>
                        <div style={{ flex: 1, position: 'relative', height: window.innerWidth < 768 ? '32px' : '48px' }}>
                            {/* Marqueurs dynamiques basés sur les périodes */}
                            {periods.map((period) => [
                                <div key={`start-${period.id}`} style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.startDate)}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: window.innerWidth < 768 ? '10px' : '12px',
                                    fontWeight: 'bold'
                                }}>{new Date(period.startDate).getDate()}</div>,
                                <div key={`end-${period.id}`} style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.endDate)}%`,
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontSize: window.innerWidth < 768 ? '10px' : '12px',
                                    fontWeight: 'bold'
                                }}>{new Date(period.endDate).getDate()}</div>
                            ]).flat()}
                        </div>
                    </div>

                    {/* Barres des périodes */}
                    {periods.map((period) => (
                        <div key={period.id} style={{ display: 'flex', height: window.innerWidth < 768 ? '80px' : '130px' }}>
                            <div style={{
                                width: window.innerWidth < 768 ? '100px' : '128px',
                                padding: window.innerWidth < 768 ? '8px 6px' : '16px 12px',
                                backgroundColor: '#fafafa',
                                fontSize: window.innerWidth < 768 ? '12px' : '15px',
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
                                backgroundColor: 'white'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    left: `${calculatePosition(period.startDate)}%`,
                                    width: `${calculateWidth(period.startDate, period.endDate)}%`,
                                    height: window.innerWidth < 768 ? '60px' : '100px',
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
                width: window.innerWidth < 768 ? '100%' : '300px',
                backgroundColor: 'white',
                borderLeft: window.innerWidth < 768 ? 'none' : '1px solid #f0f0f0',
                borderTop: window.innerWidth < 768 ? '1px solid #f0f0f0' : 'none',
                padding: window.innerWidth < 768 ? '16px' : '24px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: window.innerWidth < 768 ? '40vh' : 'auto'
            }}>
                <div style={{ 
                    position: 'sticky', 
                    top: 0, 
                    zIndex: 10, 
                    backgroundColor: 'white', 
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '16px'
                }}>
                    <AppButton
                        btnType={'submit'}
                        icon={<EditOutlined />}
                        onClick={() => setIsSemesterModalVisible(true)}
                        style={{ width: '100%' }}
                    >
                        Gérer les semestres
                    </AppButton>
                </div>
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#bfbfbf #ffffff'
                }}>
                    {periods.map((period) => (
                        <div 
                            key={period.id} 
                            onClick={() => handlePeriodClick(period)}
                            style={{
                                padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
                                borderBottom: '1px solid #f0f0f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderRadius: '8px',
                                margin: window.innerWidth < 768 ? '2px 0' : '4px 0',
                                backgroundColor: period.isActive ? 'rgba(110, 173, 255, 0.1)' : 'transparent',
                                border: period.isActive ? '1px solid rgba(110, 173, 255, 0.3)' : '1px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = period.isActive ? 'rgba(110, 173, 255, 0.2)' : '#f5f5f5';
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = period.isActive ? 'rgba(110, 173, 255, 0.1)' : 'transparent';
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth < 768 ? '8px' : '12px' }}>
                                <div style={{
                                    width: window.innerWidth < 768 ? '12px' : '16px',
                                    height: window.innerWidth < 768 ? '12px' : '16px',
                                    backgroundColor: period.color,
                                    borderRadius: '4px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}></div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: window.innerWidth < 768 ? '12px' : '14px', marginBottom: '2px' }}>
                                        {period.shortName}
                                        {period.isActive && (
                                            <span style={{ 
                                                marginLeft: '8px', 
                                                fontSize: '10px', 
                                                backgroundColor: '#52c41a', 
                                                color: 'white', 
                                                padding: '2px 6px', 
                                                borderRadius: '10px',
                                                fontWeight: 'bold'
                                            }}>ACTIF</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: window.innerWidth < 768 ? '10px' : '11px', color: '#999' }}>
                                        {period.name}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: window.innerWidth < 768 ? '9px' : '11px', color: '#666' }}>
                                <div>{formatDate(period.startDate)}</div>
                                <div>{formatDate(period.endDate)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal d'édition */}
            <Modal
                title={`Édition date de la période du ${selectedPeriod?.shortName || 'CC_1'}`}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Annuler
                    </Button>,
                    <Button 
                        key="confirm" 
                        type="primary" 
                        onClick={handleModalConfirm}
                        loading={loading}
                        disabled={!editedStartDate || !editedEndDate}
                    >
                        Confirmer
                    </Button>
                ]}
                width={800}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <Tabs.TabPane tab="Date de début" key="start">
                        <div style={{ marginBottom: '16px' }}>
                            <DatePicker
                                value={editedStartDate ? dayjs(editedStartDate) : null}
                                onChange={(date) => setEditedStartDate(date ? date.format('YYYY-MM-DD') : '')}
                                style={{ width: '100%' }}
                                placeholder="Sélectionner la date de début"
                            />
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Date de fin" key="end">
                        <div style={{ marginBottom: '16px' }}>
                            <DatePicker
                                value={editedEndDate ? dayjs(editedEndDate) : null}
                                onChange={(date) => setEditedEndDate(date ? date.format('YYYY-MM-DD') : '')}
                                style={{ width: '100%' }}
                                placeholder="Sélectionner la date de fin"
                            />
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

            {/* Modale de gestion des semestres */}
            <Modal
                title="Gestion des semestres"
                open={isSemesterModalVisible}
                onCancel={() => setIsSemesterModalVisible(false)}
                footer={[
                    <Button 
                        key="cancel" 
                        onClick={() => setIsSemesterModalVisible(false)}
                        style={{ 
                            width: '100%', 
                            borderColor: '#ff4d4f', 
                            color: '#ff4d4f',
                            backgroundColor: '#fff'
                        }}
                    >
                        Fermer
                    </Button>
                ]}
                width={1000}
            >
                <SemesterManagement />
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
export * from './actions';
export * from './slice';
export * from './components';