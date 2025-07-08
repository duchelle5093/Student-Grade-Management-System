import {Form, Input} from "antd";
import {AppButton, PasswordInputFormItem} from "../../../../components";
import {useContext} from "react";
import {StepperContext} from "../../../../contexts";
import {IdentificationInfoDataType, RegisterContext} from "../context";
// import {useAppDispatch} from "../../../../store";
// import {navigateTo} from "../../../navigation";

export const IdentificationForm =()=>{

    const { handlePrev } = useContext(StepperContext);
    const { setIdentificationInfo , register , role , personalInfo, identificationInfo ,isRegisterLoading } = useContext(RegisterContext)
    //const dispatch = useAppDispatch()


    const onFinish =(values : IdentificationInfoDataType)=>{
        const payload: IdentificationInfoDataType = {
            username: values.username,
            email: values.email,
            password: values.password
        }
        setIdentificationInfo?.(payload)
        register?.({
            ...personalInfo,
            role,
            ...identificationInfo
        })
        // dispatch(navigateTo('/auth'))
        // resetForm?.()

    }

    const disabledButton = personalInfo?.firstName === null || personalInfo?.lastName === null

    return (
        <Form name={'register'} onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'} placeholder='Entrez votre nom'/>
            </Form.Item>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Champ obligatoire',
                    },
                ]}
            >
                <Input size={'large'} placeholder='Entrez votre prenom'/>
            </Form.Item>
            {
                (role === 'ADMIN' || role === 'TEACHER') && (
                    <Form.Item
                        name="key"
                        rules={[
                            {
                                required: true,
                                message: 'Champ obligatoire',
                            },
                        ]}
                    >
                        <Input size={'large'} placeholder='Entrez votre cle'/>
                    </Form.Item>
                )
            }
            <PasswordInputFormItem/>
            <div className={'w-full flex justify-between gap-6 mt-10'}>
                <AppButton
                    className={'w-full'}
                    label={'Precedent'}
                    onClick={handlePrev}
                />
                <AppButton
                    htmlType={'submit'}
                    className={'w-full'}
                    label={'Suivant'}
                    disabled={disabledButton}
                    loading={isRegisterLoading}
                />
            </div>
        </Form>
    )
}
