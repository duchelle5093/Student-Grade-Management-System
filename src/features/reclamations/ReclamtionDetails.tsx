import {AppButton} from "../../components";
import {useContext} from "react";
import {StepperContext} from "../../contexts";
import {ReclamationValuesProps} from "../student/views/GradesTable.tsx";
import {StudentDataResDto, StudentTopicResDto} from "../../api/reponse-dto/student.res.dto.ts";
import {useAppDispatch} from "../../store";
import {useNotification} from "../../contexts";
import {submitGradeClaim} from "../grades";
import {GradeClaimReqDto} from "../../api/request-dto/gradeClaim.req.dto.ts";
import { Card, Descriptions, Typography, Space, Divider, Input } from "antd";
import { UserOutlined, BookOutlined, EditOutlined, MessageOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

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
    const dispatch = useAppDispatch();
    const { notify } = useNotification();

    const handleSubmitClaim = async () => {
        // Mapper le type de réclamation vers periodLabel complet
        const periodLabel = formValues.period;

        const grade = student?.grades.find(
            grade => grade.subjectCode === currentTopic?.code &&
                     grade.periodLabel === periodLabel
        );

        if (!grade) {
            notify({
                type: 'error',
                message: 'Erreur',
                description: 'Note non trouvée pour cette matière et période'
            });
            return;
        }

        const payload: GradeClaimReqDto = {
            gradeId: grade.id,
            requestedScore: parseFloat(formValues.requestedScore.toString()),
            cause: formValues.cause,
            period: periodLabel as 'CC_1' | 'CC_2' | 'SN_1' | 'SN_2',
            description: formValues.description
        };
        
        try {
            const result = await dispatch(submitGradeClaim(payload));
            if (submitGradeClaim.fulfilled.match(result)) {
                handleOk();
            }
        } catch (error) {
            console.error('Erreur soumission réclamation:', error);
        }
    };

    // Déterminer la note actuelle selon le type de note contestée
    let CurrentGrade = '';
    if (formValues.period === 'CC_1' || formValues.period === 'CC_2') {
        CurrentGrade = currentTopic?.cc !== null && currentTopic?.cc !== undefined ? String(currentTopic?.cc) : '-';
    } else if (formValues.period === 'SN_1' || formValues.period === 'SN_2') {
        CurrentGrade = currentTopic?.sn !== null && currentTopic?.sn !== undefined ? String(currentTopic?.sn) : '-';
    }


    return(
        <div className="p-2">
            <Title level={5} className="text-center mb-4">
                📋 Récapitulatif de la revendication
            </Title>
            
            <Space direction="vertical" size="middle" className="w-full">
                {/* Informations étudiant */}
                <Card 
                    size="small" 
                    title={
                        <Space>
                            <UserOutlined style={{ color: '#6EADFF' }} />
                            <Text strong>Informations personnelles</Text>
                        </Space>
                    }
                    className="shadow-sm"
                >
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Nom">{student.lastName}</Descriptions.Item>
                        <Descriptions.Item label="Prénom">{student.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Matricule">{student.studentId}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Détails de la réclamation */}
                <Card 
                    size="small" 
                    title={
                        <Space>
                            <BookOutlined style={{ color: '#6EADFF' }} />
                            <Text strong>Matière: {currentTopic?.title}</Text>
                        </Space>
                    }
                    className="shadow-sm"
                >
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="Type de note contestée">
                            <Text code>{formValues.period}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Note actuelle">
                            <Text type="secondary">{CurrentGrade}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Note souhaitée">
                            <Text strong style={{ color: '#6EADFF' }}>{formValues.requestedScore}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Cause">
                            <Text>{formValues.cause}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            <Text type="secondary" className="whitespace-pre-wrap">
                                {formValues.description}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Space>
            <Divider />
            
            {isTeacherView ? (
                <Card 
                    size="small" 
                    title={
                        <Space>
                            <EditOutlined style={{ color: '#6EADFF' }} />
                            <Text strong>Actions enseignant</Text>
                        </Space>
                    }
                    className="shadow-sm"
                >
                    <Space direction="vertical" size="middle" className="w-full">
                        <AppButton 
                            onClick={onApprove} 
                            className="w-full !bg-green-600 hover:!bg-green-700 !font-bold !py-3"
                            size="large"
                        >
                            ✅ Approuver la revendication
                        </AppButton>
                        
                        <div className="w-full">
                            <Text strong className="block mb-2">
                                <MessageOutlined className="mr-2" />
                                Ou rejeter avec commentaire :
                            </Text>
                            <TextArea
                                value={rejectReason}
                                onChange={(e) => onRejectReasonChange?.(e.target.value)}
                                placeholder="Expliquez le motif du rejet..."
                                rows={3}
                                className="mb-3"
                            />
                            <AppButton 
                                onClick={onReject} 
                                className="w-full !bg-red-600 hover:!bg-red-700 !font-bold !py-3"
                                disabled={!rejectReason?.trim()}
                                size="large"
                            >
                                ❌ Rejeter la revendication
                            </AppButton>
                        </div>
                    </Space>
                </Card>
            ) : !hasClaimed(currentTopic?.code || '') ? (
                <div className="flex gap-3 mt-4">
                    <AppButton 
                        onClick={handlePrev}
                        className="flex-1 !bg-gray-100 !text-gray-700 hover:!bg-gray-200 !font-bold !py-2"
                        size="middle"
                    >
                        ← Précédent
                    </AppButton>
                    <AppButton 
                        onClick={handleSubmitClaim} 
                        className="flex-1 !py-2 !font-bold"
                        size="middle"
                        style={{ backgroundColor: '#6EADFF', borderColor: '#6EADFF' }}
                    >
                        ✓ Envoyer la revendication
                    </AppButton>
                </div>
            ) : (
                <div className="mt-6">
                    <AppButton 
                        onClick={handleCancel} 
                        className="w-full !font-bold !py-4"
                        size="large"
                    >
                        ← Retour
                    </AppButton>
                </div>
            )}

        </div>
    );
}