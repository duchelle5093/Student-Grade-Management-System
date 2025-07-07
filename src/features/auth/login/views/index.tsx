import {Form, Input} from "antd";
import {PasswordInputFormItem} from "../../../../components/PasswordInputField.tsx";
import {AppButton} from "../../../../components/AppButton.tsx";
import {processLogin} from "../../actions.ts";
import {useState} from "react";
import {useAppDispatch} from "../../../../store";

export const LoginForm = ()=>{

    const dispatch = useAppDispatch();

    type SubmissionForm = {
        username: string;
        password: string;
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const onFinish = async ({
                                username,
                                password,
                            }: SubmissionForm) => {
        setIsProcessing(true);
        await dispatch(
            processLogin({
                req: {
                    username,
                    password,
                },
            })
        );
        setIsProcessing(false);
    };


    return (
        <Form name={'login'} onFinish={onFinish}>
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
            <PasswordInputFormItem/>
            <AppButton
                htmlType={'submit'}
                loading={isProcessing}
                className={'w-full'}
                label={'Se connecter'}
            />
        </Form>

    )
}