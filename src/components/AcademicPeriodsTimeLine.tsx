import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button, Typography, Card } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Period {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    isActive?: boolean;
}

// Données mockées du backend
const academicData = {
    currentPeriod: {
        id: 'cc2',
        name: 'Contrôle Continu #2',
        shortName: 'CC #2',
        startDate: '2025-02-02',
        endDate: '2025-03-15'
    },
    periods: [
        {
            id: "cc1",
            title: "CC #1",
            start: "2024-10-01",
            end: "2024-11-28",
            color: "#C4A484",
            isActive: false
        },
        {
            id: "sn1",
            title: "SN #1",
            start: "2024-11-28",
            end: "2025-02-02",
            color: "#F5C77C",
            isActive: false
        },
        {
            id: "cc2",
            title: "CC #2",
            start: "2025-02-02",
            end: "2025-03-15",
            color: "#C4A484",
            isActive: true
        },
        {
            id: "sn2",
            title: "SN #2",
            start: "2025-03-15",
            end: "2025-06-30",
            color: "#C4A484",
            isActive: false
        }
    ]
};

const periods = academicData.periods;

export const AcademicTimeline: React.FC = () => {
    // Déterminer la période active selon la propriété isActive
    const currentPeriod = periods.find(p => p.isActive) || periods[0];

    return (
        <Card className="p-6 shadow rounded-2xl bg-white">
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <div>
                    <Title level={4}>Période en cours</Title>
                    <Text className="text-amber-600 font-semibold block">
                        {currentPeriod.title === "CC #1" ? "Contrôle Continu #1" :
                         currentPeriod.title === "SN #1" ? "Session Normale #1" :
                         currentPeriod.title === "CC #2" ? "Contrôle Continu #2" :
                         "Session Normale #2"}
                    </Text>
                    <Text className="block">
                        {dayjs(currentPeriod.start).format("DD MMM")} -{" "}
                        {dayjs(currentPeriod.end).format("DD MMM")}
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
                <Button>Annuler</Button>
                <Button type="primary">Enregistrer</Button>
            </div>
        </Card>
    );
};
