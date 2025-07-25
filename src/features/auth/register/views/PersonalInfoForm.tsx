import {DatePicker, Form, Input} from "antd";
import {AppButton} from "../../../../components";
import {useContext} from "react";
import {StepperContext} from "../../../../contexts";
import {PersonalInfoDataType, RegisterContext} from "../context";

export const PersonalInfoForm =()=>{

    const { handleNext ,  handlePrev } = useContext(StepperContext);
    const { personalInfo, setPersonalInfo} = useContext(RegisterContext)


    const onFinish =(values : PersonalInfoDataType)=>{
        const payload: PersonalInfoDataType = {
            firstName : values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            dateOfBirth: values.dateOfBirth,
            placeOfBirth: values.placeOfBirth,
        }
        setPersonalInfo?.(payload)
        handleNext?.()
    }

    const disabledButton = personalInfo?.firstName === null || personalInfo?.lastName === null

    return (
        <Form name={'register'} onFinish={onFinish}>
            <Form.Item
                name="firstName"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'}  placeholder='Entrez votre nom'/>
            </Form.Item>
            <Form.Item
                name="lastName"
                className={'mb-200'}
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'}  placeholder='Entrez votre prenom'/>
            </Form.Item>
            <Form.Item
                name="phone"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'} placeholder='Entrez votre numero de telephone'/>
            </Form.Item>
            <Form.Item
                name="dateOfBirth"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <DatePicker
                    size="large"
                    placeholder={'Entez votre date de naissance'}
                    className={'w-full'}
                />
            </Form.Item>
            <Form.Item
                name="placeOfBirth"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'}  placeholder='Entrez votre lieu de naissance'/>
            </Form.Item>
            <div className={'w-full flex justify-between gap-10 mt-10'}>
                <AppButton
                    className={'w-full'}
                    label={'Precedent'}
                    onClick={handlePrev}
                />
                <AppButton
                    className={'w-full'}
                    htmlType={'submit'}
                    label={'Suivant'}
                    disabled={disabledButton}
                />
            </div>

        </Form>
    )
}