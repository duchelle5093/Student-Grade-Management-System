import {Form, Input} from "antd";
import {AppButton, PasswordInputFormItem} from "../../../../components";
import {processLogin} from "../../actions.ts";
import {useState} from "react";
import {useAppDispatch} from "../../../../store";
import {useAppNavigation} from "../../../../hooks";


export const LoginForm = ()=>{

    const dispatch = useAppDispatch();

    const {navigateTo} = useAppNavigation();

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
                navigate: navigateTo
            })
        );
        setIsProcessing(false)
        //navigate('/dashboard');
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
                <Input size={'large'} placeholder='Entrez votre Matricule'/>
            </Form.Item>
            <PasswordInputFormItem />
            <AppButton
                htmlType={'submit'}
                loading={isProcessing}
                className={'w-full'}
                label={'Se connecter'}
            />
        </Form>

    )
}