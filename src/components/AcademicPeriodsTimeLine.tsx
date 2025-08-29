import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Typography, Card } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchAllGradingWindows } from "../features/admin/actions";
import { GradingWindowResponse } from "../api/services/grading-windows.service";
import { CreatePeriodModal } from "./CreatePeriodModal";

const { Title, Text } = Typography;

interface Period {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    isActive?: boolean;
}

// Données mockées de fallback
const mockPeriods = [
    {
        id: "cc1",
        title: "CC_1",
        start: "2024-10-01",
        end: "2024-11-28",
        color: "#C4A484",
        isActive: false
    },
    {
        id: "sn1",
        title: "SN_1",
        start: "2024-11-28",
        end: "2025-02-02",
        color: "#F5C77C",
        isActive: false
    },
    {
        id: "cc2",
        title: "CC_2",
        start: "2025-02-02",
        end: "2025-03-15",
        color: "#C4A484",
        isActive: true
    },
    {
        id: "sn2",
        title: "SN_2",
        start: "2025-03-15",
        end: "2025-06-30",
        color: "#C4A484",
        isActive: false
    }
];

// Fonction pour convertir les données du backend au format de l'interface
const convertGradingWindowToPeriod = (window: GradingWindowResponse) => ({
    id: window.id.toString(),
    title: window.shortName,
    start: window.startDate,
    end: window.endDate,
    color: window.color || "#C4A484",
    isActive: window.isActive
});

export const AcademicTimeline: React.FC = () => {
    const dispatch = useAppDispatch();
    const { gradingWindows = [] } = useAppSelector(state => state.admin || {});
    const [periods, setPeriods] = useState<Period[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchAllGradingWindows());
    }, [dispatch]);

    useEffect(() => {
        if (gradingWindows && gradingWindows.length > 0) {
            // Utiliser les données du backend si disponibles
            const convertedPeriods = gradingWindows.map(convertGradingWindowToPeriod);
            setPeriods(convertedPeriods);
        } else {
            // Fallback vers les données mockées si l'API ne retourne rien
            setPeriods(mockPeriods);
        }
    }, [gradingWindows]);

    // Déterminer la période active selon la propriété isActive
    const currentPeriod = periods.find(p => p.isActive) || periods[0];

    return (
        <Card className="p-6 shadow rounded-2xl bg-white">
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <div>
                    <Title level={4}>Période en cours</Title>
                    <Text className="text-amber-600 font-semibold block">
                        {currentPeriod?.title || "Aucune période active"}
                    </Text>
                    <Text className="block">
                        {currentPeriod ? (
                            <>
                                {dayjs(currentPeriod.start).format("DD MMM")} -{" "}
                                {dayjs(currentPeriod.end).format("DD MMM")}
                            </>
                        ) : "Aucune date définie"}
                    </Text>
                </div>

                <div className="text-right">
                    <Title level={5}>Répartition des périodes</Title>
                    {periods.map((p) => (
                        <Text
                            key={p.id}
                            className={`block font-medium ${
                                p.id === currentPeriod.id ? 'bg-blue-100 px-2 py-1 rounded' : ''
                            }`}
                            style={{ color: p.id === currentPeriod.id ? '#1890ff' : p.color }}
                        >
                            {p.title} : {dayjs(p.start).format("D MMM")} –{" "}
                            {dayjs(p.end).format("D MMM")}
                        </Text>
                    ))}
                </div>
            </div>

            {/* FULLCALENDAR */}
            <div className="border rounded-lg p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate="2024-10-01"
                    headerToolbar={false}
                    height="auto"
                    fixedWeekCount={false}
                    dayHeaderFormat={{ month: "short" }}
                    views={{
                        dayGridMonth: {
                            dayHeaderFormat: { weekday: "short" },
                        },
                    }}
                    events={periods.map((p) => ({
                        id: p.id,
                        title: p.title,
                        start: p.start,
                        end: p.end,
                        display: "block",
                        color: p.color,
                        textColor: "#fff",
                    }))}
                />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 mt-6">
                <Button onClick={() => setIsCreateModalVisible(true)}>Nouvelle Période</Button>
                <Button type="primary">Enregistrer</Button>
            </div>

            {/* Modal de création */}
            <CreatePeriodModal
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onSuccess={() => {
                    setIsCreateModalVisible(false);
                    dispatch(fetchAllGradingWindows());
                }}
            />
        </Card>
    );
};
