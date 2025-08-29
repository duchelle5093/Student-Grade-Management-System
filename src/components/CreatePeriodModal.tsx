import React, { useState } from 'react';
import { 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Select, 
    ColorPicker,
    InputNumber,
    Switch,
    Row,
    Col
} from 'antd';
import { useAppDispatch } from '../store';
import { createGradingWindow } from '../features/admin/actions';
import { useNotification } from '../contexts/notification/context';

const { Option } = Select;

interface CreatePeriodModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

export const CreatePeriodModal: React.FC<CreatePeriodModalProps> = ({
    visible,
    onCancel,
    onSuccess
}) => {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            const periodData = {
                semesterId: values.semesterId || 1,
                name: values.name,
                shortName: values.shortName,
                type: values.type,
                startDate: values.startDate.format('YYYY-MM-DD'),
                endDate: values.endDate.format('YYYY-MM-DD'),
                color: values.color || '#C4A484',
                isActive: values.isActive || false,
                order: values.order || 1
            };

            const result = await dispatch(createGradingWindow(periodData));
            
            if (createGradingWindow.fulfilled.match(result)) {
                notify({
                    type: 'success',
                    message: 'Période créée',
                    description: 'La nouvelle période a été créée avec succès'
                });
                form.resetFields();
                onSuccess();
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Erreur de création',
                description: 'Une erreur est survenue lors de la création'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    // Validation des dates pour éviter les chevauchements
    const validateEndDate = (_: any, value: any) => {
        const startDate = form.getFieldValue('startDate');
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('La date de fin doit être après la date de début');
        }
        return Promise.resolve();
    };

    return (
        <Modal
            title="Créer une nouvelle période"
            open={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
            okText="Créer"
            cancelText="Annuler"
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nom de la période"
                            rules={[{ required: true, message: 'Le nom est requis' }]}
                        >
                            <Input placeholder="Ex: Contrôle Continu #1" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="shortName"
                            label="Nom court"
                            rules={[{ required: true, message: 'Le nom court est requis' }]}
                        >
                            <Input placeholder="Ex: CC_1" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="type"
                    label="Type de période"
                    rules={[{ required: true, message: 'Le type est requis' }]}
                >
                    <Select placeholder="Sélectionnez le type">
                        <Option value="CC">Contrôle Continu (CC)</Option>
                        <Option value="SN">Session Normale (SN)</Option>
                        <Option value="SR">Session de Rattrapage (SR)</Option>
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="startDate"
                            label="Date de début"
                            rules={[{ required: true, message: 'La date de début est requise' }]}
                        >
                            <DatePicker 
                                className="w-full"
                                format="DD/MM/YYYY"
                                placeholder="Sélectionnez la date"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endDate"
                            label="Date de fin"
                            rules={[
                                { required: true, message: 'La date de fin est requise' },
                                { validator: validateEndDate }
                            ]}
                        >
                            <DatePicker 
                                className="w-full"
                                format="DD/MM/YYYY"
                                placeholder="Sélectionnez la date"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="color"
                            label="Couleur"
                        >
                            <ColorPicker 
                                defaultValue="#C4A484"
                                showText
                                className="w-full"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="order"
                            label="Ordre"
                        >
                            <InputNumber 
                                min={1}
                                placeholder="1"
                                className="w-full"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="isActive"
                            label="Période active"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};