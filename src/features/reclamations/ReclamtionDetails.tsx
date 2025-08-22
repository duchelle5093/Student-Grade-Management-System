import {AppButton} from "../../components";
import {useContext} from "react";
import {StepperContext} from "../../contexts";
import {ReclamationValuesProps} from "../student/views/GradesTable.tsx";
import {StudentDataResDto, StudentTopicResDto} from "../../api/reponse-dto/student.res.dto.ts";

interface ReclamationDetailsProps {
    student: StudentDataResDto;
    currentTopic: StudentTopicResDto | null;
    formValues: ReclamationValuesProps;
    handleOk: () => void;
    handleCancel: () => void;
    hasClaimed: (topicCode: string) => boolean;
    isTeacherView?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    rejectReason?: string;
    onRejectReasonChange?: (reason: string) => void;
}

export const ReclamationsDetails = ({
    student, 
    currentTopic, 
    formValues, 
    handleOk, 
    hasClaimed, 
    handleCancel,
    isTeacherView = false,
    onApprove,
    onReject,
    rejectReason = '',
    onRejectReasonChange
}: ReclamationDetailsProps) => {

    const { handlePrev } = useContext(StepperContext);

    // Déterminer la note actuelle selon le type de note contestée
    let CurrentGrade = '';
    if (formValues.reclamationType === 'cc') {
        CurrentGrade = currentTopic?.cc !== null && currentTopic?.cc !== undefined ? String(currentTopic?.cc) : '-';
    } else if (formValues.reclamationType === 'sn') {
        CurrentGrade = currentTopic?.sn !== null && currentTopic?.sn !== undefined ? String(currentTopic?.sn) : '-';
    }


    return(
        <div className="px-2 py-1">
            <>
                <div className="text-lg font-semibold text-center -mt-8 mb-10 pt-5">
                    Récapitulatif de la revendication
                </div>
                <div className="mb-4 p-3 border rounded bg-gray-50 shadow-sm">
                    <div className="font-bold mb-1 text-gray-700 text-center">Informations personnelles</div>
                    <div className="flex  flex-col gap-4">
                        <div><span className="font-semibold">Nom:</span> {student.lastName}</div>
                        <div><span className="font-semibold">Prénom:</span> {student.firstName}</div>
                        <div><span className="font-semibold">Matricule:</span> {student.studentId}</div>
                    </div>
                </div>
                <div className="mb-4 p-3 border rounded bg-gray-50 shadow-sm">
                    <div className="font-bold mb-1 text-gray-700 text-center">Matière: {currentTopic?.title}</div>
                    <div className="flex flex-col gap-4">
                        <div><span className="font-semibold">Type de note contestée:</span> {formValues.reclamationType.toUpperCase()}</div>
                        <div><span className="font-semibold">Note actuelle:</span> {CurrentGrade}</div>
                        <div><span className="font-semibold">Note souhaitée:</span> {formValues.expectedGrade}</div>
                        <div><span className="font-semibold">Cause:</span> {formValues.reclamationReason}</div>
                        <div><span className="font-semibold">Description:</span> {formValues.description}</div>
                    </div>
                </div>
            </>
            {isTeacherView ? (
                <div className="mt-6 space-y-4">
                    <div className="flex flex-col gap-3">
                        <AppButton 
                            onClick={onApprove} 
                            className="w-full !bg-green-600 hover:!bg-green-700 !font-bold !py-3"
                        >
                            Approuver
                        </AppButton>
                        <div className="space-y-2">
                            <div className="font-medium">Ou rejeter avec motif :</div>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => onRejectReasonChange?.(e.target.value)}
                                placeholder="Motif du rejet (optionnel)"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            />
                            <AppButton 
                                onClick={onReject} 
                                className="w-full !bg-red-600 hover:!bg-red-700 !font-bold !py-3"
                                disabled={!rejectReason.trim()}
                            >
                                Rejeter
                            </AppButton>
                        </div>
                    </div>
                </div>
            ) : !hasClaimed(currentTopic?.code || '') ? (
                <div className="flex justify-between gap-2 mt-10 w-full font-bold">
                    <AppButton 
                        onClick={handlePrev}
                        className="w-1/2 !bg-white !text-primary !font-bold !py-4"
                    >
                        Précédent
                    </AppButton>
                    <AppButton 
                        onClick={handleOk} 
                        className="w-1/2 !py-4"
                    >
                        Valider
                    </AppButton>
                </div>
            ) : (
                <div className="flex justify-between gap-2 mt-10 w-full font-bold">
                    <AppButton 
                        onClick={handleCancel} 
                        className="w-full !font-bold !py-4"
                    >
                        Retour
                    </AppButton>
                </div>
            )}

        </div>
    );
}