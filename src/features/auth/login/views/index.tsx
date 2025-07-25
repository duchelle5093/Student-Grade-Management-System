import {Form, Input} from "antd";
import {AppButton, PasswordInputFormItem} from "../../../../components";
import {processLogin} from "../../actions.ts";
import {useState} from "react";
import {useAppDispatch} from "../../../../store";
import { useNavigate } from "react-router";


export const LoginForm = ()=>{

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

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
        setIsProcessing(false)
        navigate('/dashboard');
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