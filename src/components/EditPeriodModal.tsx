import { Modal } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";


interface Period {
    id: string;
    label: string;
    start: string;
    end: string;
    color: string;
}

interface EditPeriodModalProps {
    period: Period;
    onClose: () => void;
    onSave: (p: Period) => void;
}

export const EditPeriodModal = ({ period, onClose, onSave }: EditPeriodModalProps) => {
    const [start, setStart] = useState(period.start);
    const [end, setEnd] = useState(period.end);

    return (
        <Modal
            title={`Édition de la période ${period.label}`}
            open={true}
            onCancel={onClose}
            onOk={() => onSave({ ...period, start, end })}
            okText="Confirmer"
            cancelText="Annuler"
            width={800}
        >
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={start}
                selectable={true}
                height="auto"
                events={[
                    {
                        id: period.id,
                        title: `${period.label}`,
                        start,
                        end,
                        backgroundColor: period.color,
                        borderColor: period.color,
                    },
                ]}
                select={(info) => {
                    setStart(info.startStr);
                    setEnd(info.endStr);
                }}
            />
            <p className="mt-3 text-gray-500">
                Période : {new Date(start).toLocaleDateString()} →{" "}
                {new Date(end).toLocaleDateString()}
            </p>
        </Modal>
    );
};
